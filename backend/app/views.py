from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import cv2
from .alignment_and_ocr import align_images, perform_ocr
import numpy as np 
from .models import Template, OCRLocation, User
import json
from django.conf import settings
import os
from django.shortcuts import render, redirect


@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User.objects.filter(username=username, password=password).first()
        if user:
            return redirect('/accueil')
        else:
            return JsonResponse({'error': 'Invalid username or password'})
    return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def process_image(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    selected_template_name = request.POST.get('template')
    if not selected_template_name:
        return JsonResponse({'error': 'Template name is required'}, status=400)

    try:
        selected_template = Template.objects.get(name=selected_template_name)
    except Template.DoesNotExist:
        return JsonResponse({'error': 'Template not found'}, status=404)

    template_path = selected_template.template_path
    if 'images' not in request.FILES:
        return JsonResponse({'error': 'No images uploaded'}, status=400)

    results = []
    for uploaded_file in request.FILES.getlist('images'):
        file_name = uploaded_file.name
        image_data = uploaded_file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            continue 

        aligned_image = align_images(image, template_path)
        ocr_locations = selected_template.ocr_locations.all()
        if not ocr_locations.exists():
            continue  

        ocr_results = perform_ocr(aligned_image, ocr_locations)
        if not ocr_results:
            continue  

        results.append({
            'file_name': file_name,
            'ocr_results': [result for result in ocr_results if result]  
        })

    return JsonResponse({'success': True, 'results': results})
    
@csrf_exempt
def save_template(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        image_template = request.FILES.get('templateImage')
        fields_json = request.POST.get('OCRLocations')

        try:
            image_path = os.path.join(settings.BASE_DIR, 'static', 'templates', f'{name}.png') 
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            print(image_path)
            image_data = image_template.read()
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            cv2.imwrite(image_path, image)
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

