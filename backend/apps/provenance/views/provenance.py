from rest_framework import viewsets

from apps.core.permissions.rbac import RoleBasedPermission
from apps.provenance.models import DataSource, ScientificCitation
from apps.provenance.serializers import DataSourceSerializer, ScientificCitationSerializer


class DataSourceViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing data sources and citations."""

    queryset = DataSource.objects.prefetch_related("citations").all()
    serializer_class = DataSourceSerializer
    permission_classes = [RoleBasedPermission]


class ScientificCitationViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles academic BibTeX citation queries."""

    queryset = ScientificCitation.objects.select_related("data_source").all()
    serializer_class = ScientificCitationSerializer
    permission_classes = [RoleBasedPermission]
