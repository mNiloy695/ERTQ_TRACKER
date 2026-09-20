from rest_framework.routers import DefaultRouter
from apps.tectonics.views import FaultViewSet, TectonicPlateViewSet

router = DefaultRouter()
router.register(r"tectonics/plates", TectonicPlateViewSet, basename="tectonic-plate")
router.register(r"tectonics/faults", FaultViewSet, basename="active-fault")

urlpatterns = router.urls
