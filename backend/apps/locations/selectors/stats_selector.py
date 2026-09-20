from django.db.models import Avg, Count, Max
from apps.earthquakes.models import Earthquake
from apps.locations.models import Location


class LocationStatsSelector:
    """Read-only database selector for fast SQL seismicity aggregations."""

    @classmethod
    def get_seismicity_stats(cls, location: Location, radius_km: float = 300.0) -> dict:
        radius_meters = radius_km * 1000.0
        qs = Earthquake.objects.filter(geom__distance_lte=(location.geom, radius_meters))

        aggregates = qs.aggregate(
            total_earthquakes=Count("id"),
            max_magnitude=Max("magnitude"),
            avg_depth_km=Avg("depth_km"),
        )

        # Magnitude distribution bins: M4-5, M5-6, M6-7, M7+
        m4_5 = qs.filter(magnitude__gte=4.0, magnitude__lt=5.0).count()
        m5_6 = qs.filter(magnitude__gte=5.0, magnitude__lt=6.0).count()
        m6_7 = qs.filter(magnitude__gte=6.0, magnitude__lt=7.0).count()
        m7_plus = qs.filter(magnitude__gte=7.0).count()

        distribution = [
            {"magnitude_bin": "M4.0 - 4.9", "count": m4_5},
            {"magnitude_bin": "M5.0 - 5.9", "count": m5_6},
            {"magnitude_bin": "M6.0 - 6.9", "count": m6_7},
            {"magnitude_bin": "M7.0+", "count": m7_plus},
        ]

        nearest_event = qs.order_by("geom").first()
        nearest_distance_km = None
        if nearest_event:
            # Calculate distance in km
            nearest_distance_km = round(location.geom.distance(nearest_event.geom) * 111.0, 1)

        return {
            "total_earthquakes": aggregates["total_earthquakes"] or 0,
            "max_magnitude": float(aggregates["max_magnitude"]) if aggregates["max_magnitude"] else None,
            "avg_depth_km": float(aggregates["avg_depth_km"]) if aggregates["avg_depth_km"] else None,
            "magnitude_distribution": distribution,
            "nearest_event_km": nearest_distance_km,
        }
