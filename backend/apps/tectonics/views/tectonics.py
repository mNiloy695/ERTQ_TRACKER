from rest_framework import viewsets

from apps.core.permissions.rbac import RoleBasedPermission
from apps.tectonics.models import Fault, TectonicPlate
from apps.tectonics.serializers import FaultSerializer, TectonicPlateSerializer


class TectonicPlateViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing and detail views for tectonic plates."""

    queryset = TectonicPlate.objects.all()
    serializer_class = TectonicPlateSerializer
    permission_classes = [RoleBasedPermission]


class FaultViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing and detail views for active fault linestrings."""

    queryset = Fault.objects.all()
    serializer_class = FaultSerializer
    permission_classes = [RoleBasedPermission]
