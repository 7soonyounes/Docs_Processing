from django.db import models

class Template(models.Model):
    name = models.CharField(max_length=100)
    template_path = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class OCRLocation(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name='ocr_locations')
    name = models.CharField(max_length=100)
    x = models.IntegerField()
    y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    
    def __str__(self):
        return self.name
