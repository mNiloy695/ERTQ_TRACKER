from rest_framework.routers import DefaultRouter
from apps.provenance.views import DataSourceViewSet, ScientificCitationViewSet

router = DefaultRouter()
router.register(r"provenance/sources", DataSourceViewSet, basename="provenance-source")
router.register(r"provenance/citations", ScientificCitationViewSet, basename="scientific-citation")

urlpatterns = router.urls
