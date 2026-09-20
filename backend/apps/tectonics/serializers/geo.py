from rest_framework import serializers
from apps.tectonics.models import Fault, TectonicPlate


class TectonicPlateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TectonicPlate
        fields = ["id", "name", "code", "boundary_type", "movement_speed_mm_yr"]


class FaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fault
        fields = ["id", "name", "fault_type", "slip_rate_mm_yr", "max_observed_magnitude"]
