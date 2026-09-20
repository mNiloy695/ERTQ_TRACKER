from rest_framework import viewsets

from apps.core.permissions.rbac import RoleBasedPermission
from apps.hazard.models import HazardCurve, HazardModel
from apps.hazard.serializers import HazardCurveSerializer, HazardModelSerializer


class HazardModelViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing active PSHA hazard models."""

    queryset = HazardModel.objects.filter(is_active=True)
    serializer_class = HazardModelSerializer
    permission_classes = [RoleBasedPermission]


class HazardCurveViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles PSHA hazard curve queries."""

    queryset = HazardCurve.objects.select_related("hazard_model").all()
    serializer_class = HazardCurveSerializer
    permission_classes = [RoleBasedPermission]
