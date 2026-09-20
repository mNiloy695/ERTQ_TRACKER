from rest_framework.routers import DefaultRouter

from apps.earthquakes.views import EarthquakeListViewSet

router = DefaultRouter()
router.register(r"earthquakes", EarthquakeListViewSet, basename="earthquake")

urlpatterns = router.urls
