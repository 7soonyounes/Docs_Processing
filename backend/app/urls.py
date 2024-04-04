from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('process_image/', views.process_image, name='process_image'),
    path('save-template/', views.save_template, name='save_template'),
    path('api/templates/', views.get_templates, name='get_templates'),
]


