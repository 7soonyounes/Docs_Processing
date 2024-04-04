# app/alignment_and_ocr.py
from collections import namedtuple
from paddleocr import PaddleOCR
import numpy as np
import cv2
from .models import OCRLocation

np.int = np.int32
np.float = np.float64
np.bool = np.bool_

def align_images(image, template_path, maxFeatures=500, keepPercent=0.2, debug=False):
    template = cv2.imread(template_path)
    imageGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    templateGray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
    
    orb = cv2.ORB_create(maxFeatures)
    keypoints1, descriptors1 = orb.detectAndCompute(imageGray, None)
    keypoints2, descriptors2 = orb.detectAndCompute(templateGray, None)

    matcher = cv2.DescriptorMatcher_create(cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING)
    matches = matcher.match(descriptors1, descriptors2, None)

    matches = sorted(matches, key=lambda x:x.distance)
    keep = int(len(matches) * keepPercent)
    matches = matches[:keep]
    
    ptsA = np.zeros((len(matches), 2), dtype="float")
    ptsB = np.zeros((len(matches), 2), dtype="float")
    
    for i, match in enumerate(matches):
        ptsA[i] = keypoints1[match.queryIdx].pt
        ptsB[i] = keypoints2[match.trainIdx].pt
    
    H, _ = cv2.findHomography(ptsA, ptsB, method=cv2.RANSAC)
    (h, w) = template.shape[:2]
    aligned = cv2.warpPerspective(image, H, (w, h))
    return aligned

def perform_ocr(image, ocr_locations):
    ocr = PaddleOCR(use_angle_cls=True, lang="en")
    ocr_results = []
    for loc in ocr_locations:
        x, y, w, h = loc.x, loc.y, loc.width, loc.height
        roi = image[y:y+h, x:x+w]
        rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
        
        text = ocr.ocr(rgb, cls=True)
        text = text[0][1][0]
        ocr_results.append((loc.name, text))
    return ocr_results
