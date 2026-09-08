"""
routes/transcript.py

POST /api/transcript/process

Exposes the video ingestion pipeline (transcript fetch -> clean ->
chunk -> embed & store in ChromaDB) that the Streamlit app ran inside
app.py's `process_video()`. The route body/response shape matches
exactly what the React frontend's `services/api/transcript.js`
(`getProcessedTranscript`) sends and expects:

    Request:  { "youtube_url": "https://www.youtube.com/watch?v=..." }
    Response: {
        "video_id": "...",
        "raw_transcript": "...",
        "cleaned_transcript": "...",
        "duration": 754,
        "num_chunks": 12,
        "transcript_length": 8421,
        "collection_name": "video_...",
        "already_processed": false
    }
"""

from flask import Blueprint, request

from services.transcript_service import process_video_pipeline
from utils.exceptions import (
    InvalidYouTubeURLError,
    TranscriptNotFoundError,
    TranscriptFetchError,
    EmbeddingGenerationError,
    VectorStoreError,
)
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, require_non_empty_string

transcript_bp = Blueprint("transcript", __name__)


@transcript_bp.route("/transcript/process", methods=["POST"])
def process_transcript():
    body = get_json_body(request)

    try:
        youtube_url = require_non_empty_string(body, "youtube_url")
        result = process_video_pipeline(youtube_url)
        return success_response(result)

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except InvalidYouTubeURLError as exc:
        return error_response(str(exc), "InvalidYouTubeURLError", status=400)
    except TranscriptNotFoundError as exc:
        return error_response(str(exc), "TranscriptNotFoundError", status=404)
    except TranscriptFetchError as exc:
        import traceback
        traceback.print_exc()

        return error_response(
            str(exc),
            "TranscriptFetchError",
            status=502,
        )
    except EmbeddingGenerationError as exc:
        return error_response(str(exc), "EmbeddingGenerationError", status=500)
    except VectorStoreError as exc:
        return error_response(str(exc), "VectorStoreError", status=500)
    except Exception as exc:
        import traceback
        traceback.print_exc()

        return error_response(
            str(exc),
            "UnexpectedError",
            status=500,
        )
