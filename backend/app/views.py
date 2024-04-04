# app/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import cv2
from .alignment_and_ocr import align_images, perform_ocr
import numpy as np 
from .models import Template, OCRLocation
import json
from django.conf import settings
import os
import base64

@csrf_exempt
def process_image(request):
    if request.method == 'POST':
        try:
            uploaded_file = request.FILES['image']
            selected_template_name = request.POST.get('template', '')
            selected_template = Template.objects.get(name=selected_template_name)
            image_data = uploaded_file.read()
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            template = os.path.join('static', 'templates', 'template1.jpeg')
            aligned_image = align_images(image, template)
            ocr_results = perform_ocr(aligned_image, selected_template.ocrlocation_set.all())

            return JsonResponse({'success': True, 'ocr_results': ocr_results})
        except KeyError as e:
            return JsonResponse({'error': str(e)})
        except Template.DoesNotExist:
            return JsonResponse({'error': 'Selected template does not exist'})
    else:
        return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def save_template(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        image_template = request.FILES.get('templateImage')
        fields_json = request.POST.get('OCRLocations')  

        try:
            image_path = os.path.join(settings.BASE_DIR, 'backend', 'static', 'templates', name)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)  # Ensure directory exists
            
            with open(image_path, 'wb') as f:
                for chunk in image_template.chunks():
                    f.write(chunk)

            template = Template.objects.create(name=name, template_path=image_path)
            fields = json.loads(fields_json)
            for field_data in fields:
                OCRLocation.objects.create(template=template, **field_data)

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'})
    
@csrf_exempt
def get_templates(request):
    templates = Template.objects.all().values('name') 
    return JsonResponse(list(templates), safe=False)