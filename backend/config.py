"""
config.py

Centralized configuration for the Video Learning Assistant Flask
backend. Loads environment variables and defines global constants used
across the application.

Every constant from the original Streamlit config.py (API keys, chunk
sizes, ChromaDB settings, Groq model/prompt settings) is reused
unchanged. Only Flask-specific settings (host/port/CORS/secret key)
have been added for the API server itself.
"""
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(
    os.path.join(BASE_DIR, ".env")
)
# ---------------------------------------------------------------------------
# API Keys
# ---------------------------------------------------------------------------
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is missing. "
        "Create backend/.env and add GROQ_API_KEY."
    )
# ---------------------------------------------------------------------------
# Embedding Model Configuration
# ---------------------------------------------------------------------------
EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

# ---------------------------------------------------------------------------
# Text Chunking Configuration
# ---------------------------------------------------------------------------
CHUNK_SIZE = 2000
CHUNK_OVERLAP = 300

# ---------------------------------------------------------------------------
# ChromaDB Configuration
# ---------------------------------------------------------------------------
# NOTE: path updated only to point at the backend's own database/
# directory (see REQUIRED BACKEND STRUCTURE); persistence behavior,
# collection naming, and all ChromaDB usage is otherwise unchanged.
CHROMA_PERSIST_DIRECTORY: str = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "database",
    "chroma_db",
)

CHROMA_COLLECTION_PREFIX: str = "video_"

# ---------------------------------------------------------------------------
# Retrieval Configuration
# ---------------------------------------------------------------------------
TOP_K_RESULTS: int = 5

# ---------------------------------------------------------------------------
# Groq Configuration
# ---------------------------------------------------------------------------
GROQ_MODEL_NAME: str = "openai/gpt-oss-120b"

GROQ_API_URL: str = (
    "https://api.groq.com/openai/v1/chat/completions"
)

LLM_TEMPERATURE: float = 0.2
LLM_MAX_TOKENS: int = 1024

# ---------------------------------------------------------------------------
# RAG Prompt Template
# ---------------------------------------------------------------------------
RAG_PROMPT_TEMPLATE: str = """You are an educational AI assistant.

Answer only from the provided transcript context.

If the answer is not available in the transcript, respond:
"I could not find this information in the video transcript."

Context:
{retrieved_chunks}

Question:
{user_question}

Answer:"""

# ---------------------------------------------------------------------------
# Doubt Clarification (Chat) Prompt Template
# ---------------------------------------------------------------------------
DOUBT_PROMPT_TEMPLATE: str = """You are an educational AI tutor.

Answer only from the provided transcript context.

If information is unavailable in the transcript, reply:
"I could not find this information in the video."

Be conversational and explain concepts clearly, the way a helpful tutor would.
Do not invent information that isn't grounded in the transcript context below.

Context:
{retrieved_chunks}

Question:
{user_question}

Answer:"""

# ---------------------------------------------------------------------------
# Application Metadata
# ---------------------------------------------------------------------------
APP_TITLE: str = "🎓 AI-Powered Educational Video Learning Assistant"

APP_DESCRIPTION: str = (
    "Paste a YouTube video URL, let the AI process its transcript, "
    "and ask questions strictly answered from the video's content."
)

# ---------------------------------------------------------------------------
# Flask Configuration (new: required to run the app as a Flask API)
# ---------------------------------------------------------------------------
FLASK_ENV: str = os.getenv("FLASK_ENV", "development")
FLASK_DEBUG: bool = os.getenv("FLASK_DEBUG", "1") == "1"
SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-in-production")
HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "5000"))

# ---------------------------------------------------------------------------
# CORS Configuration (new: allows the React frontend to call this API)
# ---------------------------------------------------------------------------
_default_origins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

# ---------------------------------------------------------------------------
# Uploads Directory (new: present for parity with the required folder
# structure; the app currently has no file-upload endpoints since
# video ingestion is URL-based)
# ---------------------------------------------------------------------------
UPLOADS_DIRECTORY: str = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "uploads",
)
