from rest_framework import serializers
from apps.earthquakes.models import Earthquake


class EarthquakeListSerializer(serializers.ModelSerializer):
    """Lightweight serializer optimized for fast map marker & list rendering."""

    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    magnitude = serializers.FloatField()
    depth_km = serializers.FloatField()

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
            "source",
        ]
