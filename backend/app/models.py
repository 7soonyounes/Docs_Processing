from django.db import models
from collections import namedtuple

class Template(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    OCRLocation = models.CharField(max_length=255) 

    def __str__(self):
        return self.name

    def set_ocr_location(self, id, bbox):
        self.OCRLocation = f"{id},{bbox}"

    def get_ocr_location(self):
        if self.OCRLocation:
            id, bbox = self.OCRLocation.split(',')
            return namedtuple("OCRLocation", ["id", "bbox"])(id=id, bbox=bbox)
        else:
            return None

class TemplateField(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    x = models.IntegerField()
    y = models.IntegerField()
    w = models.IntegerField()
    h = models.IntegerField()

    def __str__(self):
        return self.name
