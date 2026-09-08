# Intelligent YouTube Learn AI — Backend

Flask REST API for the AI-Powered Educational Video Learning
Assistant. This is a **1:1 behavioral port** of the original
Streamlit application's Python logic — every prompt, model parameter,
chunking strategy, retrieval query, validation rule, and error
message is unchanged. Only the delivery mechanism moved: instead of
driving `st.session_state` and rendering Streamlit widgets, each
feature is now a stateless JSON endpoint that the React frontend
calls directly.

## Getting started

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in GROQ_API_KEY
python app.py
```

The API runs at `http://localhost:5000` by default (`HOST`/`PORT` in
`.env`). Health check: `GET http://localhost:5000/api/health`.

For production, run with Gunicorn (already in `requirements.txt`):

```bash
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

## Project structure

```
backend/
├── app.py                    Flask app factory, CORS, blueprint registration, error handlers
├── config.py                  All settings (Groq, ChromaDB, chunking, prompts, CORS, Flask)
├── requirements.txt
├── runtime.txt
├── .env.example
├── .gitignore
│
├── routes/                    One blueprint per feature — thin, validate + call service + respond
│   ├── health.py                GET  /api/health
│   ├── transcript.py             POST /api/transcript/process
│   ├── summary.py                POST /api/summary/generate
│   ├── notes.py                  POST /api/notes/generate
│   ├── chat.py                   POST /api/chat/ask
│   ├── mcq.py                    POST /api/mcq/generate
│   ├── recommendations.py        POST /api/recommendations/generate
│   └── concept_map.py            POST /api/concept-map/generate
│
├── services/                  All business logic, ported verbatim from the Streamlit modules
│   ├── youtube_service.py        yt-dlp transcript fetching (from transcript.py)
│   ├── transcript_service.py      URL parsing + ingestion pipeline (from transcript.py + app.py)
│   ├── embedding_service.py       Chunking, ChromaDB, Sentence-Transformers (from embeddings.py)
│   ├── summary_service.py         Hierarchical RAG summary (from summary.py)
│   ├── notes_service.py           Hierarchical RAG notes (from notes.py)
│   ├── mcq_service.py             RAG-based MCQ generation (from mcq.py)
│   ├── recommendation_service.py  Learning path recommendations (from recommendations.py)
│   ├── concept_map_service.py     Concept map + Mermaid rendering (from concept_map.py)
│   └── rag_service.py             Doubt-clarification RAG chat (from rag.py)
│
├── models/                    Empty — no ORM; ChromaDB is the persistence layer (see models/__init__.py)
│
├── utils/
│   ├── text_cleaning.py          Transcript cleaning (from utils/text_cleaning.py, unchanged)
│   ├── exceptions.py              Custom exception hierarchy (from utils/exceptions.py, unchanged)
│   ├── helpers.py                 New: JSON response envelopes (success_response/error_response)
│   └── validators.py              New: request-body validation (required fields, types)
│
├── database/
│   └── chroma_db/              ChromaDB's persistent storage directory (gitignored, kept via .gitkeep)
│
├── prompts/                   Present for structural parity — every prompt stays inline in its
│                                service module exactly as in the original files, so prompt text
│                                is never duplicated or drifted between two locations
│
└── uploads/                   Present for structural parity — the app ingests videos by URL, not
                                 file upload, so this directory has no active endpoints yet
```

## API reference

All endpoints are prefixed with `/api` and return JSON. This matches
`VITE_API_BASE_URL` in the React frontend's `.env.example` (default
`/api`), so no frontend changes are required.

### `GET /api/health`

```json
{ "status": "ok", "service": "Intelligent YouTube Learn AI API", "groq_configured": true }
```

### `POST /api/transcript/process`

Ports `app.py`'s `process_video()` pipeline: extract video ID → fetch
transcript → clean → chunk → embed & store in ChromaDB (skipped if the
video was already processed).

Request:
```json
{ "youtube_url": "https://www.youtube.com/watch?v=..." }
```

Response:
```json
{
  "video_id": "dQw4w9WgXcQ",
  "raw_transcript": "[00:00] ...",
  "cleaned_transcript": "...",
  "duration": 754,
  "num_chunks": 12,
  "transcript_length": 8421,
  "collection_name": "video_dQw4w9WgXcQ",
  "already_processed": false
}
```

Errors: `InvalidYouTubeURLError` (400), `TranscriptNotFoundError`
(404), `TranscriptFetchError` (502), `EmbeddingGenerationError` /
`VectorStoreError` (500).

### `POST /api/summary/generate`

Ports `summary.py`'s `generate_summary()`.

Request: `{ "video_id": "...", "duration": 754 }`
Response: `{ "summary": "# Topic Title\n\n..." }`

### `POST /api/notes/generate`

Ports `notes.py`'s `generate_key_notes()`.

Request: `{ "video_id": "..." }`
Response: `{ "notes": ["...", "...", ...] }`

### `POST /api/chat/ask`

Ports `chat_page.py`'s `handle_user_question()`: retrieves relevant
chunks via `embedding_service.query_video_chunks()`, then answers via
`rag_service.answer_doubt()`, with the same HTML-tag stripping the
original `clean_answer()` performed.

Request: `{ "video_id": "...", "question": "..." }`
Response: `{ "answer": "...", "retrieved_chunks": ["...", ...] }`

### `POST /api/mcq/generate`

Ports `mcq.py`'s `generate_mcqs()`.

Request: `{ "video_id": "...", "duration": 754 }`
Response:
```json
{
  "mcqs": [
    {
      "difficulty": "Easy",
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_answer": "A",
      "explanation": "..."
    }
  ]
}
```

### `POST /api/recommendations/generate`

Ports `recommendations.py`'s `generate_recommendations()`. Matches the
original's behavior of returning an empty list when `summary` is
falsy, rather than raising a validation error.

Request: `{ "summary": "...", "notes": ["...", ...], "duration": 754 }`
Response: `{ "recommendations": [ { "topic": "...", "reason": "..." } ] }`

### `POST /api/concept-map/generate`

Ports `concept_map.py`'s `generate_concept_map()`. Returns `null` (not
an error) when there isn't yet enough summary/notes/transcript to
build a map — exactly like the original function returning `None`.

Request: `{ "transcript": "...", "summary": "...", "notes": ["...", ...] }`
Response: `{ "tree": {...}, "mermaid": "graph TD\n...", "stats": {...} }` or `null`

## Error format

Every error response follows the same envelope:

```json
{ "error": true, "type": "TranscriptNotFoundError", "message": "English subtitles not available." }
```

`type` is always the originating exception's class name (unchanged
from `utils/exceptions.py`), and `message` is always the exact string
the original Streamlit code raised — never rewritten.

## What changed vs. the Streamlit app

Nothing about *how* any feature works. What changed is only the
transport layer:

- `st.session_state` → the React frontend's `AppContext` (state now
  lives client-side; each endpoint is stateless and takes whatever
  IDs/content it needs as request parameters).
- `st.status` / `st.spinner` / `st.write` progress narration → removed
  from the service layer (it was UI-only); the frontend renders its
  own loading states around each Axios call instead.
- Direct Python function calls from Streamlit pages → HTTP requests
  from the React frontend's `src/services/api/*.js` files.

No prompt was reworded, no model parameter was changed, no chunking
or retrieval logic was altered, and no exception message was rewritten.
