"""
app.py

Main Flask entry point for the AI-Powered Educational Video Learning
Assistant API.

This replaces the original Streamlit app.py's role as the application
entry point. It does not contain any business logic itself — every
feature (transcript processing, summaries, notes, chat, MCQs,
recommendations, concept maps) lives in services/ and is exposed
through routes/, exactly mirroring the original Python modules
(transcript.py, summary.py, notes.py, rag.py, mcq.py,
recommendations.py, concept_map.py, embeddings.py) with their logic
unchanged.
"""

import os

from flask import Flask, jsonify
from flask_cors import CORS

import config
from utils.exceptions import VideoAssistantError
from utils.helpers import error_response

from routes.health import health_bp
from routes.transcript import transcript_bp
from routes.summary import summary_bp
from routes.notes import notes_bp
from routes.chat import chat_bp
from routes.mcq import mcq_bp
from routes.recommendations import recommendations_bp
from routes.concept_map import concept_map_bp


def create_app() -> Flask:
    """Application factory: builds and configures the Flask app."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["JSON_SORT_KEYS"] = False

    # -----------------------------------------------------------------
    # CORS — allow the React frontend (dev server and/or configured
    # production origin(s)) to call this API.
    # -----------------------------------------------------------------
    CORS(
        app,
        resources={r"/api/*": {"origins": config.CORS_ORIGINS}},
        supports_credentials=True,
    )

    # -----------------------------------------------------------------
    # Ensure the directories the app depends on exist (ChromaDB
    # persistence dir, uploads dir) so a fresh clone works immediately.
    # -----------------------------------------------------------------
    os.makedirs(config.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
    os.makedirs(config.UPLOADS_DIRECTORY, exist_ok=True)

    # -----------------------------------------------------------------
    # Blueprints — every route is namespaced under /api, matching the
    # base URL the React frontend's Axios client already targets
    # (VITE_API_BASE_URL, default "/api").
    # -----------------------------------------------------------------
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(transcript_bp, url_prefix="/api")
    app.register_blueprint(summary_bp, url_prefix="/api")
    app.register_blueprint(notes_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(mcq_bp, url_prefix="/api")
    app.register_blueprint(recommendations_bp, url_prefix="/api")
    app.register_blueprint(concept_map_bp, url_prefix="/api")

    # -----------------------------------------------------------------
    # Global error handlers — every response is JSON, never HTML,
    # matching the "RESPONSE FORMAT" requirement.
    # -----------------------------------------------------------------
    @app.errorhandler(VideoAssistantError)
    def handle_video_assistant_error(exc: VideoAssistantError):
        return error_response(str(exc), type(exc).__name__, status=400)

    @app.errorhandler(404)
    def handle_not_found(exc):
        return error_response("The requested endpoint does not exist.", "NotFound", status=404)

    @app.errorhandler(405)
    def handle_method_not_allowed(exc):
        return error_response("This HTTP method is not allowed for this endpoint.", "MethodNotAllowed", status=405)

    @app.errorhandler(500)
    def handle_internal_error(exc):
        return error_response("An internal server error occurred.", "InternalServerError", status=500)

    @app.route("/")
    def index():
        return jsonify(
            {
                "service": "Intelligent YouTube Learn AI API",
                "status": "running",
                "docs": "See README.md for the full list of /api endpoints.",
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.FLASK_DEBUG,
        use_reloader=False
    )
