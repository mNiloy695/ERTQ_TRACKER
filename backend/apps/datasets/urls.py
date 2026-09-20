from rest_framework.routers import DefaultRouter
from apps.datasets.views import CatalogDatasetViewSet

router = DefaultRouter()
router.register(r"datasets", CatalogDatasetViewSet, basename="dataset")

urlpatterns = router.urls
