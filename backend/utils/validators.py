"""
utils/validators.py

Lightweight request-payload validation for the Flask routes. These
are new (Streamlit had no equivalent — user input arrived through
widgets, not HTTP bodies) but they only check for the presence/shape
of fields; they never alter the values that get passed on to the
existing service functions.
"""

from typing import Any, Iterable

from utils.exceptions import VideoAssistantError


class ValidationError(VideoAssistantError):
    """Raised when an incoming request body is missing required fields."""
    pass


def require_fields(body: dict, fields: Iterable[str]) -> None:
    """
    Ensure every field in `fields` is present in `body` and not None.

    Raises:
        ValidationError: naming the first missing field found.
    """
    for field in fields:
        if field not in body or body.get(field) is None:
            raise ValidationError(f"Missing required field: '{field}'.")


def require_non_empty_string(body: dict, field: str) -> str:
    """
    Ensure `field` is present in `body` and is a non-blank string.
    Returns the stripped string value.
    """
    value = body.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"Field '{field}' must be a non-empty string.")
    return value.strip()


def optional_int(body: dict, field: str, default: int = 0) -> int:
    """
    Best-effort extraction of an optional integer field (e.g.
    `duration`), falling back to `default` when missing or invalid.
    """
    value = body.get(field, default)
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def optional_list(body: dict, field: str) -> list:
    """Best-effort extraction of an optional list field, defaulting to []."""
    value = body.get(field)
    return value if isinstance(value, list) else []


def optional_str(body: dict, field: str, default: Any = None):
    """Best-effort extraction of an optional string field."""
    value = body.get(field, default)
    return value
