from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardEnvelopePagination(PageNumberPagination):
    """Standardized page-number pagination enforcing uniform API envelope."""

    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 500

    def get_paginated_response(self, data):
        return Response(
            {
                "data": data,
                "meta": {
                    "page": self.page.number,
                    "page_size": self.get_page_size(self.request),
                    "total_pages": self.page.paginator.num_pages,
                    "total_records": self.page.paginator.count,
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "errors": [],
            }
        )
