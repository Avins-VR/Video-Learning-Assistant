"""
routes/concept_map.py

POST /api/concept-map/generate

Exposes concept_map_service.generate_concept_map(), matching the
request/response shape expected by the React frontend's
`services/api/conceptMap.js` (`generateConceptMap`):

    Request:  { "transcript": "...", "summary": "...", "notes": ["...", ...] }
    Response: { "tree": {...}, "mermaid": "graph TD\n...", "stats": {...} }
              or `null` when there isn't enough source content yet —
              exactly mirroring the original generate_concept_map()
              returning None, which concept_map_page.py checked for.
"""

from flask import Blueprint, request

from services.concept_map_service import generate_concept_map
from utils.exceptions import LLMGenerationError
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, optional_str, optional_list

concept_map_bp = Blueprint("concept_map", __name__)


@concept_map_bp.route("/concept-map/generate", methods=["POST"])
def generate_concept_map_route():
    body = get_json_body(request)

    try:
        transcript = optional_str(body, "transcript", default=None)
        summary = optional_str(body, "summary", default=None)
        notes = optional_list(body, "notes")

        result = generate_concept_map(transcript, summary, notes)
        # `result` is None when there isn't enough source content yet,
        # matching the original function's contract exactly.
        return success_response(result)

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except LLMGenerationError as exc:
        return error_response(str(exc), "LLMGenerationError", status=502)
    except Exception as exc:  # noqa: BLE001
        return error_response(
            f"An unexpected error occurred: {str(exc)}", "UnexpectedError", status=500
        )
