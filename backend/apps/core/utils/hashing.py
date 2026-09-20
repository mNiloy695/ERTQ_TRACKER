import hashlib
import json


def calculate_config_hash(config_dict: dict) -> str:
    """Generates a SHA-256 hash string for model calculation configuration dicts."""
    encoded = json.dumps(config_dict, sort_keys=True).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()
