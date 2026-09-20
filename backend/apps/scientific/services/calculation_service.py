from apps.core.services.base import BaseService
from apps.core.utils.hashing import calculate_config_hash
from apps.scientific.models import ScientificCalculation


class CalculationService(BaseService):

    @classmethod
    def create_calculation_job(cls, data: dict) -> ScientificCalculation:
        config_hash = calculate_config_hash(data.get("input_params", {}))

        def _create():
            return ScientificCalculation.objects.create(
                calculation_type=data["calculation_type"],
                model_version_tag=data["model_version_tag"],
                intensity_measure_type=data.get("intensity_measure_type", "PGA"),
                time_horizon_years=data.get("time_horizon_years", 50),
                input_params=data.get("input_params", {}),
                config_hash=config_hash,
                status="QUEUED",
            )

        return cls.execute_in_transaction(_create)
