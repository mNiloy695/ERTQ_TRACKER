from rest_framework import serializers
from apps.datasets.models import CatalogDataset, DatasetVersion


class DatasetVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetVersion
        fields = ["id", "version_tag", "record_count", "checksum", "ingested_at"]


class CatalogDatasetSerializer(serializers.ModelSerializer):
    versions = DatasetVersionSerializer(many=True, read_only=True)

    class Meta:
        model = CatalogDataset
        fields = ["id", "code", "name", "organization", "license", "source_url", "versions"]
