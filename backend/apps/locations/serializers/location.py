from rest_framework import serializers
from apps.locations.models import Country, Location


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["id", "name", "code", "region"]


class LocationSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "slug",
            "administrative_area",
            "latitude",
            "longitude",
            "elevation_m",
            "vs30_m_s",
            "country",
        ]
