from django.db import models

# Create your models here.





class Point(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()

    def __str__(self):
        return '{id}: {description}  [{latitude}, {longitude}]'.format(
            id=self.id,
            description=self.description,
            latitude=self.latitude,
            longitude=self.longitude)
