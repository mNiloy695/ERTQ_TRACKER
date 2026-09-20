from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel


class Earthquake(TimeStampedModel):
    """Canonical Earthquake entity for historic and real-time events."""

    external_id = models.CharField(max_length=255, unique=True, db_index=True)
    origin_time = models.DateTimeField(db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    depth_km = models.DecimalField(max_digits=6, decimal_places=2, db_index=True)
    magnitude = models.DecimalField(max_digits=3, decimal_places=1, db_index=True)
    magnitude_type = models.CharField(max_length=10)
    location_name = models.CharField(max_length=255, blank=True)
    region = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=100, db_index=True)
    catalog_version = models.CharField(max_length=50)
    geom = models.PointField(srid=4326, spatial_index=True)

    class Meta:
        db_table = "earthquakes"
        ordering = ["-origin_time"]

    def __str__(self):
        return f"M{self.magnitude} - {self.location_name or self.external_id} ({self.origin_time.strftime('%Y-%m-%d')})"
