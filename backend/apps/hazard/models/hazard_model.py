from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel


class HazardModel(TimeStampedModel):
    """Authoritative PSHA Hazard Model entity."""

    name = models.CharField(max_length=255, unique=True)
    organization = models.CharField(max_length=255)  # e.g., 'GEM Foundation', 'USGS'
    version = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    config_hash = models.CharField(max_length=64, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "hazard_models"

    def __str__(self):
        return f"{self.name} (v{self.version})"


class HazardCurve(TimeStampedModel):
    """Calculated PSHA Hazard Curve data point entity for a specific location and model."""

    hazard_model = models.ForeignKey(HazardModel, on_delete=models.CASCADE, related_name="curves")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    intensity_measure_type = models.CharField(max_length=20, default="PGA")  # PGA, SA(0.2s), SA(1.0s)
    vs30_m_s = models.FloatField(default=760.0)
    pga_values = models.JSONField(help_text="List of ground motion intensity values in g")
    annual_exceedance_rates = models.JSONField(help_text="List of annual rates of exceedance lambda(x)")
    geom = models.PointField(srid=4326, spatial_index=True)

    class Meta:
        db_table = "hazard_curves"

    def __str__(self):
        return f"HazardCurve {self.intensity_measure_type} at ({self.latitude}, {self.longitude})"
