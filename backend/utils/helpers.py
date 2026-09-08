"""
utils/helpers.py

Small response-formatting helpers shared by every route module. These
are additive (new code needed to expose the existing Python functions
over HTTP) — they do not touch any business logic, prompts, or
algorithms from the original Streamlit modules.
"""

from typing import Any, Optional

from flask import jsonify


def success_response(data: Any = None, status: int = 200):
    """
    Wrap a successful result in a consistent JSON envelope.

    Every route returns `jsonify(data)`-compatible payloads that match
    exactly what the React frontend's Axios services expect (e.g.
    `{ "summary": "..." }`, `{ "notes": [...] }`), so `data` here is
    typically already the exact dict the frontend destructures.
    """
    response = jsonify(data)
    response.status_code = status
    return response


def error_response(message: str, error_type: str = "VideoAssistantError", status: int = 400,
                    extra: Optional[dict] = None):
    """
    Wrap an error in a consistent JSON envelope.

    Args:
        message: Human-readable error message (reused verbatim from the
            original exception's message — never rewritten).
        error_type: The originating exception's class name, so the
            frontend can branch on error category if needed.
        status: HTTP status code to return.
        extra: Any additional fields to merge into the error payload.
    """
    payload = {
        "error": True,
        "type": error_type,
        "message": message,
    }
    if extra:
        payload.update(extra)

    response = jsonify(payload)
    response.status_code = status
    return response


def get_json_body(request) -> dict:
    """
    Safely extract a JSON body from a Flask request, defaulting to an
    empty dict when the body is missing or not valid JSON, so route
    handlers can uniformly `.get(...)` expected fields and rely on
    validators.py to raise a clear error for anything required.
    """
    return request.get_json(silent=True) or {}
