from rest_framework import viewsets

from apps.core.pagination.standard import StandardEnvelopePagination
from apps.core.permissions.rbac import RoleBasedPermission
from apps.earthquakes.serializers import EarthquakeListSerializer, EarthquakeQueryParamsSerializer
from apps.earthquakes.services import EarthquakeQueryService


class EarthquakeListViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles global earthquake catalog listing and spatial bounding box queries."""

    serializer_class = EarthquakeListSerializer
    permission_classes = [RoleBasedPermission]
    pagination_class = StandardEnvelopePagination

    def get_queryset(self):
        query_serializer = EarthquakeQueryParamsSerializer(data=self.request.query_params)
        query_serializer.is_valid(raise_exception=True)
        return EarthquakeQueryService.filter_by_bbox_and_params(query_serializer.validated_data)
