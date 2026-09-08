"""
routes/recommendations.py

POST /api/recommendations/generate

Exposes recommendation_service.generate_recommendations(), matching
the request/response shape expected by the React frontend's
`services/api/recommendations.js` (`generateRecommendations`):

    Request:  { "summary": "...", "notes": ["...", ...], "duration": 754 }
    Response: { "recommendations": [ { "topic": "...", "reason": "..." }, ... ] }
"""

from flask import Blueprint, request

from services.recommendation_service import generate_recommendations
from utils.exceptions import LLMGenerationError
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, optional_int, optional_list, optional_str

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("/recommendations/generate", methods=["POST"])
def generate_recommendations_route():
    body = get_json_body(request)

    try:
        # NOTE: `summary` is intentionally NOT required here — the
        # original generate_recommendations() returns [] when summary
        # is falsy rather than raising, so that exact behavior is
        # preserved instead of turning it into a 400 at the API layer.
        summary = optional_str(body, "summary", default="")
        notes = optional_list(body, "notes")
        duration = optional_int(body, "duration", default=0)

        recommendations = generate_recommendations(summary, notes, duration)
        return success_response({"recommendations": recommendations})

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except LLMGenerationError as exc:
        return error_response(str(exc), "LLMGenerationError", status=502)
    except Exception as exc:  # noqa: BLE001
        return error_response(
            f"An unexpected error occurred: {str(exc)}", "UnexpectedError", status=500
        )
