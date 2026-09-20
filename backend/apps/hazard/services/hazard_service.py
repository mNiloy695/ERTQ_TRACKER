import math
from apps.core.services.base import BaseQueryService
from apps.hazard.models import HazardCurve


class HazardService(BaseQueryService):
    model = HazardCurve

    @classmethod
    def calculate_exceedance_probability(cls, annual_rate: float, time_horizon_years: int = 50) -> float:
        """Calculates Poisson probability of exceedance: P = 1 - exp(-lambda * t)."""
        if annual_rate <= 0:
            return 0.0
        return round(1.0 - math.exp(-annual_rate * time_horizon_years), 4)

    @classmethod
    def calculate_return_period(cls, annual_rate: float) -> float:
        """Calculates return period in years: T_R = 1 / lambda."""
        if annual_rate <= 0:
            return 0.0
        return round(1.0 / annual_rate, 1)
