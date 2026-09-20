from rest_framework import serializers


class MagnitudeDistributionSerializer(serializers.Serializer):
    magnitude_bin = serializers.CharField()
    count = serializers.IntegerField()


class SeismicityStatsSerializer(serializers.Serializer):
    total_earthquakes = serializers.IntegerField()
    max_magnitude = serializers.FloatField(allow_null=True)
    avg_depth_km = serializers.FloatField(allow_null=True)
    magnitude_distribution = MagnitudeDistributionSerializer(many=True)
    nearest_event_km = serializers.FloatField(allow_null=True)
