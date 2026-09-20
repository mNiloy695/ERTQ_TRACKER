from django.contrib.gis.geos import Polygon


def build_bbox_polygon(min_lon: float, min_lat: float, max_lon: float, max_lat: float) -> Polygon:
    """Builds a PostGIS 4326 SRID Polygon from bounding box parameters."""
    return Polygon.from_bbox((min_lon, min_lat, max_lon, max_lat))
