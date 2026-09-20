from django.contrib.gis.db.models.functions import Distance
from django.db.models import Q

from apps.core.services.base import BaseQueryService
from apps.earthquakes.models import Earthquake
from apps.locations.models import Location


class LocationService(BaseQueryService):
    model = Location

    @classmethod
    def search_locations(cls, query: str):
        if not query or len(query.strip()) < 2:
            return cls.get_queryset().none()

        clean_query = query.strip()
        return cls.get_queryset().filter(
            Q(name__icontains=clean_query)
            | Q(administrative_area__icontains=clean_query)
            | Q(country__name__icontains=clean_query)
        ).select_related("country")

    @classmethod
    def get_nearby_earthquakes(cls, location: Location, radius_km: float = 300.0):
        radius_meters = radius_km * 1000.0
        return (
            Earthquake.objects.filter(geom__distance_lte=(location.geom, radius_meters))
            .annotate(distance_m=Distance("geom", location.geom))
            .order_by("-origin_time")
        )
