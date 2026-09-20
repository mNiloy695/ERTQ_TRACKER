from apps.core.services.base import BaseQueryService
from apps.core.utils.geo import build_bbox_polygon
from apps.earthquakes.models import Earthquake


class EarthquakeQueryService(BaseQueryService):
    """Spatial and attribute filtering service for earthquake catalog queries."""

    model = Earthquake

    @classmethod
    def filter_by_bbox_and_params(cls, params: dict):
        qs = cls.get_queryset()

        # Bounding box spatial filter
        if all(k in params and params[k] is not None for k in ("min_lon", "min_lat", "max_lon", "max_lat")):
            bbox = build_bbox_polygon(
                float(params["min_lon"]),
                float(params["min_lat"]),
                float(params["max_lon"]),
                float(params["max_lat"]),
            )
            qs = qs.filter(geom__within=bbox)

        # Attribute filters
        if "min_magnitude" in params and params["min_magnitude"] is not None:
            qs = qs.filter(magnitude__gte=float(params["min_magnitude"]))
        if "max_depth" in params and params["max_depth"] is not None:
            qs = qs.filter(depth_km__lte=float(params["max_depth"]))
        if "start_time" in params and params["start_time"] is not None:
            qs = qs.filter(origin_time__gte=params["start_time"])
        if "end_time" in params and params["end_time"] is not None:
            qs = qs.filter(origin_time__lte=params["end_time"])

        return qs
