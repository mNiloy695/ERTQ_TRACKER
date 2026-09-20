from rest_framework import viewsets

from apps.core.permissions.rbac import RoleBasedPermission
from apps.datasets.models import CatalogDataset
from apps.datasets.serializers import CatalogDatasetSerializer


class CatalogDatasetViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing datasets and version tags."""

    queryset = CatalogDataset.objects.prefetch_related("versions").all()
    serializer_class = CatalogDatasetSerializer
    permission_classes = [RoleBasedPermission]
