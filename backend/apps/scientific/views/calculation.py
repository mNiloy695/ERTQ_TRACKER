from rest_framework import status, viewsets
from rest_framework.response import Response

from apps.core.permissions.rbac import IsScientificResearcherOrReadOnly
from apps.scientific.models import ScientificCalculation
from apps.scientific.serializers import CalculationRequestSerializer
from apps.scientific.services import CalculationService


class ScientificCalculationViewSet(viewsets.ModelViewSet):
    """Handles dispatching custom calculation jobs and retrieving job statuses."""

    queryset = ScientificCalculation.objects.all()
    serializer_class = CalculationRequestSerializer
    permission_classes = [IsScientificResearcherOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = CalculationService.create_calculation_job(serializer.validated_data)
        out_serializer = self.get_serializer(job)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)
