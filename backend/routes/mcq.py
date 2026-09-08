"""
routes/mcq.py

POST /api/mcq/generate

Exposes mcq_service.generate_mcqs(), matching the request/response
shape expected by the React frontend's `services/api/mcq.js`
(`generateMcqs`):

    Request:  { "video_id": "...", "duration": 754 }
    Response: { "mcqs": [ { "difficulty": "Easy", "question": "...",
                             "options": {...}, "correct_answer": "A",
                             "explanation": "..." }, ... ] }
"""

from flask import Blueprint, request

from services.mcq_service import generate_mcqs
from utils.exceptions import LLMGenerationError
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, require_non_empty_string, optional_int

mcq_bp = Blueprint("mcq", __name__)


@mcq_bp.route("/mcq/generate", methods=["POST"])
def generate_mcqs_route():
    body = get_json_body(request)

    try:
        video_id = require_non_empty_string(body, "video_id")
        duration = optional_int(body, "duration", default=0)

        mcqs = generate_mcqs(video_id, duration)
        return success_response({"mcqs": mcqs})

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except LLMGenerationError as exc:
        return error_response(str(exc), "LLMGenerationError", status=502)
    except Exception as exc:  # noqa: BLE001
        return error_response(
            f"An unexpected error occurred: {str(exc)}", "UnexpectedError", status=500
        )
