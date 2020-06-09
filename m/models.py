from django.db import models

# Create your models here.


class Flight(models.Model):
    origin = models.CharField(max_length=64)
    destination = models.CharField(max_length=64)
    duration = models.IntegerField()

    def __str__(self):
        return '{id}: {origin} to {destination} {duration}min'.format(
            id=self.id,
            origin=self.origin,
            destination=self.destination,
            duration=self.duration)


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
