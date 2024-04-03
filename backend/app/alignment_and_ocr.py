# app/alignment_and_ocr.py
import numpy as np
import cv2
from collections import namedtuple
from paddleocr import PaddleOCR
# Define OCRLocation namedtuple
OCRLocation = namedtuple("OCRLocation", ["id", "bbox"])

# Define OCR locations for attestation template
OCR_LOCATIONS_ATT = [
    OCRLocation("Name", (180, 676, 378 - 180, 694 - 676)),
    OCRLocation("Agence", (504, 656, 619 - 504, 672 - 656)),
    OCRLocation("Date", (327, 654, 409 - 327, 670 - 654)),
    OCRLocation("RIB", (181, 573, 750 - 181, 600 - 573))
]

# Define OCR locations for fiche template
OCR_LOCATIONS_FICHE = [
    OCRLocation("Nom", (413, 342, 1190 - 413, 422 - 342)),
    OCRLocation("Prenom", (413, 432, 1190 - 413, 512 - 432)),
    OCRLocation("Adresse", (291, 510, 1200 - 291, 610 - 510)),
    OCRLocation("NUM", (315, 635, 1200 - 315, 721 - 635))
]

np.int = np.int32
np.float = np.float64
np.bool = np.bool_

def align_images(image, template_path, maxFeatures=500, keepPercent=0.2, debug=False):
    # Load the template image
    template = cv2.imread(template_path)

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
        text = ocr.ocr(rgb, cls=True)
        
        # Extract only the text from the OCR result
        text = text[0][1][0]

        # Append the extracted text to the results list
        ocr_results.append((loc.id, text))
    return ocr_results
