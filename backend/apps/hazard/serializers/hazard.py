from rest_framework import serializers
from apps.hazard.models import HazardCurve, HazardModel


class HazardModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HazardModel
        fields = ["id", "name", "organization", "version", "description", "config_hash", "is_active"]


class HazardCurveSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    hazard_model = HazardModelSerializer(read_only=True)

    class Meta:
        model = HazardCurve
        fields = [
            "id",
            "intensity_measure_type",
            "latitude",
            "longitude",
            "vs30_m_s",
            "pga_values",
            "annual_exceedance_rates",
            "hazard_model",
        ]
