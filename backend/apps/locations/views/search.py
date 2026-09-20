from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.permissions.rbac import RoleBasedPermission
from apps.earthquakes.serializers import EarthquakeListSerializer
from apps.locations.models import Location
from apps.locations.selectors import LocationStatsSelector
from apps.locations.serializers import LocationSerializer, SeismicityStatsSerializer
from apps.locations.services import LocationService


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles location search, profile retrieval, nearby earthquakes, and seismicity stats."""

    queryset = Location.objects.select_related("country").all()
    serializer_class = LocationSerializer
    permission_classes = [RoleBasedPermission]
    lookup_field = "slug"

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        query = request.query_params.get("q", "")
        results = LocationService.search_locations(query)
        page = self.paginate_queryset(results)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="earthquakes")
    def earthquakes(self, request, slug=None):
        location = self.get_object()
        radius_km = float(request.query_params.get("radius_km", 300.0))
        qs = LocationService.get_nearby_earthquakes(location, radius_km)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = EarthquakeListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = EarthquakeListSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="statistics")
    def statistics(self, request, slug=None):
        location = self.get_object()
        radius_km = float(request.query_params.get("radius_km", 300.0))
        stats = LocationStatsSelector.get_seismicity_stats(location, radius_km)
        serializer = SeismicityStatsSerializer(stats)
        return Response(serializer.data)
