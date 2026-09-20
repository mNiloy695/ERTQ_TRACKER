from django.db import models
from apps.core.models.base import TimeStampedModel


class CatalogDataset(TimeStampedModel):
    """Authoritative catalog dataset entity."""

    code = models.CharField(max_length=50, unique=True, db_index=True)  # e.g., 'USGS_ANSS'
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    license = models.CharField(max_length=100)
    source_url = models.URLField(blank=True)

    class Meta:
        db_table = "catalog_datasets"

    def __str__(self):
        return f"{self.name} ({self.code})"


class DatasetVersion(TimeStampedModel):
    """Snapshot version of an ingested catalog dataset."""

    dataset = models.ForeignKey(CatalogDataset, on_delete=models.CASCADE, related_name="versions")
    version_tag = models.CharField(max_length=50, db_index=True)  # e.g., '2026-09-20'
    record_count = models.BigIntegerField(default=0)
    checksum = models.CharField(max_length=64, blank=True)
    ingested_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dataset_versions"
        unique_together = ("dataset", "version_tag")

    def __str__(self):
        return f"{self.dataset.code}:{self.version_tag}"
