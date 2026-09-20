from rest_framework import serializers
from apps.scientific.models import ScientificCalculation


class CalculationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScientificCalculation
        fields = [
            "id",
            "calculation_type",
            "model_version_tag",
            "intensity_measure_type",
            "time_horizon_years",
            "input_params",
            "status",
            "config_hash",
            "result_uri",
            "error_message",
            "started_at",
            "completed_at",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "config_hash",
            "result_uri",
            "error_message",
            "started_at",
            "completed_at",
            "created_at",
        ]
