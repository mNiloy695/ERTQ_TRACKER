import logging
from django.db import transaction

logger = logging.getLogger(__name__)


class BaseService:
    """Abstract base service for transactional business logic operations."""

    @classmethod
    def execute_in_transaction(cls, func, *args, **kwargs):
        with transaction.atomic():
            return func(*args, **kwargs)


class BaseQueryService:
    """Abstract base query service for standardized spatial & temporal filtering."""

    model = None

    @classmethod
    def get_queryset(cls):
        if cls.model is None:
            raise NotImplementedError("Service must define a 'model' attribute.")
        return cls.model.objects.all()
