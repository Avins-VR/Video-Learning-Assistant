"""
routes/notes.py

POST /api/notes/generate

Exposes notes_service.generate_key_notes(), matching the request/
response shape expected by the React frontend's
`services/api/notes.js` (`generateKeyNotes`):

    Request:  { "video_id": "..." }
    Response: { "notes": ["...", "...", ...] }
"""

from flask import Blueprint, request

from services.notes_service import generate_key_notes
from utils.exceptions import LLMGenerationError
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, require_non_empty_string

notes_bp = Blueprint("notes", __name__)


@notes_bp.route("/notes/generate", methods=["POST"])
def generate_notes_route():
    body = get_json_body(request)

    try:
        video_id = require_non_empty_string(body, "video_id")

        notes = generate_key_notes(video_id)
        return success_response({"notes": notes})

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except LLMGenerationError as exc:
        return error_response(str(exc), "LLMGenerationError", status=502)
    except Exception as exc:  # noqa: BLE001
        return error_response(
            f"An unexpected error occurred: {str(exc)}", "UnexpectedError", status=500
        )
