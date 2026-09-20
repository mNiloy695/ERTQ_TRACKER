from rest_framework import serializers
from apps.earthquakes.models import Earthquake, EarthquakeSourceRecord


class SourceRecordSerializer(serializers.ModelSerializer):
    reported_latitude = serializers.FloatField()
    reported_longitude = serializers.FloatField()
    reported_depth_km = serializers.FloatField()
    reported_magnitude = serializers.FloatField()

    class Meta:
        model = EarthquakeSourceRecord
        fields = [
            "id",
            "provider",
            "external_id",
            "reported_time",
            "reported_latitude",
            "reported_longitude",
            "reported_depth_km",
            "reported_magnitude",
            "reported_magnitude_type",
            "raw_payload_uri",
        ]


class EarthquakeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single earthquake event details with provenance & contributing source records."""

    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    depth_km = serializers.FloatField()
    magnitude = serializers.FloatField()
    source_records = SourceRecordSerializer(many=True, read_only=True)
    scientific_basis = serializers.SerializerMethodField()

    class Meta:
        model = Earthquake
        fields = [
            "id",
            "external_id",
            "origin_time",
            "latitude",
            "longitude",
            "depth_km",
            "magnitude",
            "magnitude_type",
            "location_name",
            "region",
            "source",
            "catalog_version",
            "source_records",
            "scientific_basis",
            "created_at",
            "updated_at",
        ]

    def get_scientific_basis(self, obj):
        return {
            "source_agency": obj.source,
            "external_event_id": obj.external_id,
            "catalog_version": obj.catalog_version,
            "license": "Public Domain (USGS ANSS ComCat)",
            "provenance_url": f"https://earthquake.usgs.gov/earthquakes/eventpage/{obj.external_id}",
        }
