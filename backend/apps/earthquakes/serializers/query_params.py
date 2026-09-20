from rest_framework import serializers


class EarthquakeQueryParamsSerializer(serializers.Serializer):
    """Query parameter validation serializer for bounding box and catalog filters."""

    min_lon = serializers.FloatField(required=False, min_value=-180.0, max_value=180.0)
    min_lat = serializers.FloatField(required=False, min_value=-90.0, max_value=90.0)
    max_lon = serializers.FloatField(required=False, min_value=-180.0, max_value=180.0)
    max_lat = serializers.FloatField(required=False, min_value=-90.0, max_value=90.0)

    min_magnitude = serializers.FloatField(required=False, min_value=0.0, max_value=10.0)
    max_depth = serializers.FloatField(required=False, min_value=0.0)
    start_time = serializers.DateTimeField(required=False)
    end_time = serializers.DateTimeField(required=False)
