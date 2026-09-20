from django.contrib.gis.geos import Point
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.earthquakes.models import Earthquake


class EarthquakeApiTests(APITestCase):

    def setUp(self):
        self.eq1 = Earthquake.objects.create(
            external_id="us7000test1",
            origin_time=timezone.now(),
            latitude=23.8103,
            longitude=90.4125,
            depth_km=15.0,
            magnitude=5.5,
            magnitude_type="Mw",
            location_name="Dhaka, Bangladesh",
            region="South Asia",
            source="USGS",
            catalog_version="2026-09-20",
            geom=Point(90.4125, 23.8103, srid=4326),
        )

    def test_list_earthquakes(self):
        response = self.client.get("/api/v1/earthquakes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertEqual(len(response.data["data"]), 1)

    def test_spatial_bbox_filter(self):
        response = self.client.get(
            "/api/v1/earthquakes/",
            {"min_lon": 85.0, "min_lat": 20.0, "max_lon": 95.0, "max_lat": 28.0},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_spatial_bbox_out_of_range(self):
        response = self.client.get(
            "/api/v1/earthquakes/",
            {"min_lon": 0.0, "min_lat": 0.0, "max_lon": 10.0, "max_lat": 10.0},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 0)

    def test_detail_earthquake(self):
        response = self.client.get(f"/api/v1/earthquakes/{self.eq1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["external_id"], "us7000test1")
        self.assertIn("scientific_basis", response.data["data"])
