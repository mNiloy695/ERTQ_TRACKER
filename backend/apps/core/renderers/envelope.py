from rest_framework.renderers import JSONRenderer


class StandardEnvelopeJSONRenderer(JSONRenderer):
    """Standardized DRF response renderer ensuring all responses are wrapped in standard envelopes."""

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is not None and not isinstance(data, dict) or ("data" not in data and "errors" not in data):
            data = {"data": data, "meta": {}, "errors": []}
        return super().render(data, accepted_media_type, renderer_context)
