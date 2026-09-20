from rest_framework import viewsets
from rest_framework.response import Response

from apps.core.permissions.rbac import RoleBasedPermission
from apps.earthquakes.models import Earthquake
from apps.earthquakes.serializers import EarthquakeDetailSerializer


class EarthquakeDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles single earthquake detail view with source records & provenance."""

    queryset = Earthquake.objects.prefetch_related("source_records").all()
    serializer_class = EarthquakeDetailSerializer
    permission_classes = [RoleBasedPermission]
    lookup_field = "pk"
