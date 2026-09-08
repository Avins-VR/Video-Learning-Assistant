"""
routes/chat.py

POST /api/chat/ask

Exposes the Doubt Clarification flow — retrieve relevant transcript
chunks via embedding_service.query_video_chunks(), then answer with
rag_service.answer_doubt() — matching chat_page.py's
`handle_user_question()` exactly. Request/response shape matches the
React frontend's `services/api/chat.js` (`askDoubt`):

    Request:  { "video_id": "...", "question": "..." }
    Response: { "answer": "...", "retrieved_chunks": ["...", ...] }
"""

import re

from flask import Blueprint, request

from services.embedding_service import query_video_chunks
from services.rag_service import answer_doubt
from utils.exceptions import (
    EmptyQuestionError,
    EmbeddingGenerationError,
    VectorStoreError,
    LLMGenerationError,
)
from utils.helpers import success_response, error_response, get_json_body
from utils.validators import ValidationError, require_non_empty_string

chat_bp = Blueprint("chat", __name__)


def _clean_answer(answer: str) -> str:
    """Strip stray HTML tags from the model's answer, exactly as
    chat_page.py's `clean_answer()` did."""
    if not answer:
        return ""
    return re.sub(r"<[^>]*>", "", answer).strip()


@chat_bp.route("/chat/ask", methods=["POST"])
def ask_doubt():
    body = get_json_body(request)

    try:
        video_id = require_non_empty_string(body, "video_id")
        question = require_non_empty_string(body, "question")

        retrieved_chunks = query_video_chunks(
            video_id=video_id,
            question=question,
        )

        raw_answer = answer_doubt(retrieved_chunks, question)
        answer = _clean_answer(raw_answer)

        return success_response(
            {
                "answer": answer,
                "retrieved_chunks": retrieved_chunks,
            }
        )

    except ValidationError as exc:
        return error_response(str(exc), "ValidationError", status=400)
    except EmptyQuestionError as exc:
        return error_response(str(exc), "EmptyQuestionError", status=400)
    except EmbeddingGenerationError as exc:
        return error_response(str(exc), "EmbeddingGenerationError", status=500)
    except VectorStoreError as exc:
        return error_response(str(exc), "VectorStoreError", status=500)
    except LLMGenerationError as exc:
        return error_response(str(exc), "LLMGenerationError", status=502)
    except Exception as exc:  # noqa: BLE001
        return error_response(
            f"An unexpected error occurred: {str(exc)}", "UnexpectedError", status=500
        )
