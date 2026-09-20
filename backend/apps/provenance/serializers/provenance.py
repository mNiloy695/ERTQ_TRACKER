from rest_framework import serializers
from apps.provenance.models import DataSource, ScientificCitation


class ScientificCitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScientificCitation
        fields = ["id", "title", "authors", "journal_or_publisher", "year", "doi", "bibtex_entry"]


class DataSourceSerializer(serializers.ModelSerializer):
    citations = ScientificCitationSerializer(many=True, read_only=True)

    class Meta:
        model = DataSource
        fields = ["id", "code", "name", "organization", "url", "license", "citations"]
