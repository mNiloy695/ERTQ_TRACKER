from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel


class TectonicPlate(TimeStampedModel):
    """Tectonic Plate boundary polygon entity."""

    name = models.CharField(max_length=255, unique=True, db_index=True)
    code = models.CharField(max_length=50, unique=True)  # e.g., 'IN', 'EU', 'PAC'
    boundary_type = models.CharField(
        max_length=50,
        choices=[
            ("convergent", "Convergent Subduction"),
            ("divergent", "Divergent Spreading"),
            ("transform", "Transform Fault"),
        ],
    )
    movement_speed_mm_yr = models.FloatField(null=True, blank=True)
    geom = models.MultiPolygonField(srid=4326, spatial_index=True)

    class Meta:
        db_table = "tectonic_plates"

    def __str__(self):
        return f"{self.name} ({self.code})"


class Fault(TimeStampedModel):
    """Active seismic fault line entity."""

    name = models.CharField(max_length=255, db_index=True)
    fault_type = models.CharField(max_length=100, blank=True)  # e.g., 'Strike-Slip', 'Reverse Thrust'
    slip_rate_mm_yr = models.FloatField(null=True, blank=True)
    max_observed_magnitude = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    geom = models.MultiLineStringField(srid=4326, spatial_index=True)

    class Meta:
        db_table = "active_faults"

    def __str__(self):
        return self.name
