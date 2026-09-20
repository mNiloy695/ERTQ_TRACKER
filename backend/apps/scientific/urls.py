from rest_framework.routers import DefaultRouter
from apps.scientific.views import ScientificCalculationViewSet

router = DefaultRouter()
router.register(r"scientific/calculations", ScientificCalculationViewSet, basename="scientific-calculation")

urlpatterns = router.urls
