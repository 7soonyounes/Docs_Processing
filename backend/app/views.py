# app/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import cv2
from .alignment_and_ocr import align_images, perform_ocr, OCR_LOCATIONS_ATT, OCR_LOCATIONS_FICHE
import os
import numpy as np 
from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from django.views import View
from .models import Template, TemplateField
import json




@csrf_exempt
def process_image(request):
    if request.method == 'POST':
        try:
            # Get the uploaded image file and text data
            uploaded_file = request.FILES['image']
            # text_data = request.POST.get('text_data', '')
            selected_template = request.POST.get('template', '')

            # Determine template image path based on selected template
            if selected_template == 'attestation':
                template_path = os.path.join('static', 'templates', 'template1.jpeg')
                ocr_locations = OCR_LOCATIONS_ATT
            elif selected_template == 'fiche':
                template_path = os.path.join('static', 'templates', 'template2.jpeg')
                ocr_locations = OCR_LOCATIONS_FICHE
            else:
                return JsonResponse({'error': 'Invalid template selected'})

            image_data = uploaded_file.read()
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            aligned_image = align_images(image, template_path)

            ocr_results = perform_ocr(aligned_image, ocr_locations)
            return JsonResponse({'success': True, 'ocr_results': ocr_results})
        except KeyError as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def save_template_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        image = request.FILES.get('templateImage')
        fields = json.loads(request.POST.get('fields'))

        template = Template(name=name, image=image)
        template.save()

        # Save fields
        for field_data in fields:
            template_field = TemplateField(template=template, **field_data)
            template_field.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'})