from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel


class Country(TimeStampedModel):
    """Country spatial entity."""

    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=3, unique=True, db_index=True)  # ISO 3166-1 alpha-2/3
    region = models.CharField(max_length=100, blank=True)
    geom = models.MultiPolygonField(srid=4326, spatial_index=True, null=True, blank=True)

    class Meta:
        db_table = "countries"
        verbose_name_plural = "countries"

    def __str__(self):
        return self.name


class Location(TimeStampedModel):
    """City or geographic location entity."""

    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True, related_name="locations")
    administrative_area = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    elevation_m = models.FloatField(null=True, blank=True)
    vs30_m_s = models.FloatField(default=760.0, help_value="Average shear-wave velocity at 30m depth")
    geom = models.PointField(srid=4326, spatial_index=True)

    class Meta:
        db_table = "locations"

    def __str__(self):
        return f"{self.name}, {self.country.name if self.country else ''}"
