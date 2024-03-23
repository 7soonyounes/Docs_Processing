from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
import cv2
import numpy as np
from paddleocr import PaddleOCR
from collections import namedtuple
import os
from django.contrib.staticfiles import finders
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import logging
from collections import namedtuple

OCRLocation = namedtuple("OCRLocation", ["id", "bbox", "filter_keywords"])
OCR_LOCATIONS_ATT = [
    OCRLocation("name", (180, 676, 378 - 180, 694 - 676), ["Mr"]),
    OCRLocation("agence", (504, 656, 619 - 504, 672 - 656), []),
    OCRLocation("date", (327, 654, 409 - 327, 670 - 654), []),
    OCRLocation("RIB", (181, 573, 750 - 181, 600 - 573), ['[', ']'])
]

OCR_LOCATIONS_FICHE = [
    OCRLocation("nom", (413, 342, 1190 - 413, 422 - 342), []),
    OCRLocation("prenom", (413, 432, 1190 - 413, 512 - 432), []),
    OCRLocation("adresse", (291, 510, 1200 - 291, 610 - 510), []),
    OCRLocation("num", (315, 635, 1200 - 315, 721 - 635), [])
]


logger = logging.getLogger(__name__)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def process_image(request):
    try:
        if request.method == 'POST' and request.FILES.get('image'):
            uploaded_image_file = request.FILES['image']
            uploaded_image = cv2.imdecode(np.frombuffer(uploaded_image_file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
            template_type = request.data.get('template_type')

            template_path = finders.find(f'templates/{template_type}.jpeg')
            if not template_path:
                return JsonResponse({'error': 'Template not found'}, status=404)

            template = cv2.imread(template_path)
            if template is None:
                return JsonResponse({'error': 'Failed to load template image'}, status=500)

            aligned_image = align_images(uploaded_image, template)
            ocr_results = perform_ocr(aligned_image, OCR_LOCATIONS_ATT if template_type == 'attestation' else OCR_LOCATIONS_FICHE)

            # Encode the aligned image to a file-like object
            _, encoded_image = cv2.imencode('.jpeg', aligned_image)
            aligned_image_file = ContentFile(encoded_image.tobytes())

            # Save the aligned image
            temp_file_name = default_storage.save('aligned/aligned_image.jpeg', aligned_image_file)
            temp_file_path = default_storage.url(temp_file_name)

            return JsonResponse({'aligned_image_path': temp_file_path, 'ocr_results': ocr_results})
        else:
            return JsonResponse({'error': 'No image provided'}, status=400)
    except Exception as e:
        logger.exception("Error processing image: %s", e)
        return JsonResponse({'error': 'Error processing image. Please try again.'}, status=500)


# When saving an image or any file
def save_aligned_image(image_content, filename='aligned_image.jpeg'):
    if not os.path.exists('media/aligned'):
        os.makedirs('media/aligned')
    image_content = cv2.imencode('.jpeg', image_content)[1]
    file_path = os.path.join('aligned', filename)
    # Save your file
    default_storage.save(file_path, ContentFile(image_content))
    return default_storage.url(file_path)

def align_images(image, template, maxFeatures=500, keepPercent=0.2, debug=False):
    # Convert images to grayscale
    imageGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    templateGray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
    
    # Use ORB to detect keypoints and extract (binary) local invariant features
    orb = cv2.ORB_create(maxFeatures)
    keypoints1, descriptors1 = orb.detectAndCompute(imageGray, None)
    keypoints2, descriptors2 = orb.detectAndCompute(templateGray, None)
    
    # Match features between the two images
    matcher = cv2.DescriptorMatcher_create(cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING)
    matches = matcher.match(descriptors1, descriptors2, None)
    
    # Sort matches by their distance (i.e., quality)
    matches = sorted(matches, key=lambda x:x.distance)
    
    # Keep only the top matches
    keep = int(len(matches) * keepPercent)
    matches = matches[:keep]
    
    # Allocate memory for the keypoints from the good matches
    ptsA = np.zeros((len(matches), 2), dtype="float")
    ptsB = np.zeros((len(matches), 2), dtype="float")
    
    for i, match in enumerate(matches):
        ptsA[i] = keypoints1[match.queryIdx].pt
        ptsB[i] = keypoints2[match.trainIdx].pt
    
    # Compute the homography matrix
    H, _ = cv2.findHomography(ptsA, ptsB, method=cv2.RANSAC)
    
    # Use the homography matrix to align the images
    (h, w) = template.shape[:2]
    aligned = cv2.warpPerspective(image, H, (w, h))
    
    return aligned

def perform_ocr(image, ocr_locations):
    # Initialize the PaddleOCR with English language
    ocr = PaddleOCR(use_angle_cls=True, lang="en")
    
    ocr_results = []
    for loc in ocr_locations:
        x, y, w, h = loc.bbox
        roi = image[y:y+h, x:x+w]
        rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
        
        # Perform OCR on the ROI
        result = ocr.ocr(rgb, cls=True)
        
        # Extracting text from the OCR result
        text = [line[1][0] for line in result[0] if len(line[1]) > 0]  # Assuming the structure is [[(box), (text, confidence)]]
        
        # Apply any necessary filtering based on filter_keywords if required
        filtered_text = []
        for t in text:
            if not any(kw in t for kw in loc.filter_keywords):  # Simple filter example
                filtered_text.append(t)
        
        ocr_results.append((loc.id, filtered_text))
    
    return ocr_results
