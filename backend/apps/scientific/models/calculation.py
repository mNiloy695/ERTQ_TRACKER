from django.contrib.gis.db import models
from apps.core.models.base import TimeStampedModel


class ScientificCalculation(TimeStampedModel):
    """Scientific OpenQuake hazard calculation job entity."""

    CALCULATION_TYPE_CHOICES = [
        ("classical_psha", "Classical PSHA"),
        ("event_based_psha", "Event-Based PSHA"),
        ("scenario_hazard", "Scenario Hazard"),
        ("scenario_damage", "Scenario Damage"),
    ]

    STATUS_CHOICES = [
        ("QUEUED", "Queued"),
        ("RUNNING", "Running"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
        ("CANCELLED", "Cancelled"),
    ]

    calculation_type = models.CharField(max_length=50, choices=CALCULATION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="QUEUED", db_index=True)
    model_version_tag = models.CharField(max_length=100)
    intensity_measure_type = models.CharField(max_length=20, default="PGA")
    time_horizon_years = models.IntegerField(default=50)
    config_hash = models.CharField(max_length=64, db_index=True)
    input_params = models.JSONField(help_text="JSON representation of calculation inputs")
    result_uri = models.CharField(max_length=512, blank=True, help_text="Path to Cloudflare R2 result artifact")
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "scientific_calculations"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Job {self.id} [{self.calculation_type}] - {self.status}"
