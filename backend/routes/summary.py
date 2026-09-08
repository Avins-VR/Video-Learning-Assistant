"""
routes/summary.py

POST /api/summary/generate

Exposes summary_service.generate_summary(), matching the request/
response shape expected by the React frontend's
`services/api/summary.js` (`generateSummary`):

    Request:  { "video_id": "...", "duration": 754 }
    Response: { "summary": "# Topic Title\n\n..." }
"""

from flask import Blueprint, request

from services.summary_service import generate_summary
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, require_non_empty_string, optional_int

summary_bp = Blueprint("summary", __name__)


@summary_bp.route("/summary/generate", methods=["POST"])
def generate_summary_route():
    body = get_json_body(request)

    try:
        video_id = require_non_empty_string(body, "video_id")
        duration = optional_int(body, "duration", default=0)

        summary_text = generate_summary(video_id, duration)
        return success_response({"summary": summary_text})

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except Exception as exc:  # noqa: BLE001
        import traceback

        traceback.print_exc()

        return error_response(
            f"An unexpected error occurred: {str(exc)}",
            "UnexpectedError",
            status=500,
        )
