from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('process_image/', views.process_image, name='process_image'),
    path('save-template/', views.save_template_view, name='save_template'),
]


