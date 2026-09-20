from rest_framework.routers import DefaultRouter
from apps.hazard.views import HazardCurveViewSet, HazardModelViewSet

router = DefaultRouter()
router.register(r"hazard/models", HazardModelViewSet, basename="hazard-model")
router.register(r"hazard/curves", HazardCurveViewSet, basename="hazard-curve")

urlpatterns = router.urls
