import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Global DRF exception handler converting exceptions into uniform error envelopes."""
    response = exception_handler(exc, context)

    if response is not None:
        formatted_errors = []
        if isinstance(response.data, dict):
            for key, value in response.data.items():
                detail = value[0] if isinstance(value, list) else value
                formatted_errors.append({"field": key, "message": str(detail)})
        elif isinstance(response.data, list):
            for item in response.data:
                formatted_errors.append({"message": str(item)})
        else:
            formatted_errors.append({"message": str(response.data)})

        response.data = {"data": None, "meta": {}, "errors": formatted_errors}
    else:
        logger.error(f"Unhandled Server Error: {exc}", exc_info=True)
        response = Response(
            {"data": None, "meta": {}, "errors": [{"message": "An internal server error occurred."}]},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
