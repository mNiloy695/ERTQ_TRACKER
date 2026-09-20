from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel
from apps.earthquakes.models.earthquake import Earthquake


class EarthquakeSourceRecord(TimeStampedModel):
    """Contributing regional or national network report for an earthquake event."""

    earthquake = models.ForeignKey(
        Earthquake,
        on_delete=models.CASCADE,
        related_name="source_records",
    )
    provider = models.CharField(max_length=50, db_index=True)  # e.g., 'USGS', 'EMSC', 'JMA'
    external_id = models.CharField(max_length=255, db_index=True)
    reported_time = models.DateTimeField()
    reported_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    reported_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    reported_depth_km = models.DecimalField(max_digits=6, decimal_places=2)
    reported_magnitude = models.DecimalField(max_digits=3, decimal_places=1)
    reported_magnitude_type = models.CharField(max_length=10)
    raw_payload_uri = models.CharField(max_length=512, blank=True)

    class Meta:
        db_table = "earthquake_source_records"
        unique_together = ("provider", "external_id")

    def __str__(self):
        return f"{self.provider}:{self.external_id} -> {self.earthquake.external_id}"
