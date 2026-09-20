from django.db import models
from apps.core.models.base import TimeStampedModel


class DataSource(TimeStampedModel):
    """Scientific Data Source entity."""

    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    url = models.URLField()
    license = models.CharField(max_length=100)

    class Meta:
        db_table = "data_sources"

    def __str__(self):
        return f"{self.name} ({self.code})"


class ScientificCitation(TimeStampedModel):
    """Academic BibTeX citation entry for datasets and hazard models."""

    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="citations")
    title = models.CharField(max_length=512)
    authors = models.TextField(help_text="Comma separated list of author names")
    journal_or_publisher = models.CharField(max_length=255, blank=True)
    year = models.IntegerField()
    doi = models.CharField(max_length=255, blank=True)
    bibtex_entry = models.TextField(help_text="Raw BibTeX formatted string")

    class Meta:
        db_table = "scientific_citations"

    def __str__(self):
        return f"{self.title} ({self.year})"
