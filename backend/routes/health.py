"""
routes/health.py

GET /api/health

Simple liveness/readiness check for the API — new endpoint (Streamlit
had no equivalent), useful for uptime checks, load balancers, and
confirming the frontend can reach the backend before wiring up the
rest of the flow.
"""

from flask import Blueprint

import config
from utils.helpers import success_response

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    return success_response(
        {
            "status": "ok",
            "service": "Intelligent YouTube Learn AI API",
            "groq_configured": bool(config.GROQ_API_KEY),
        }
    )
