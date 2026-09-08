"""
services/transcript_service.py

Handles:
    - Parsing/validating YouTube URLs to extract the video ID
      (ported verbatim from transcript.py's `extract_video_id`).
    - Orchestrating transcript fetch + cleaning
      (ported verbatim from transcript.py's `get_processed_transcript`,
      now calling out to youtube_service.fetch_transcript).
    - The full video ingestion pipeline — fetch, clean, chunk, and
      store embeddings — ported from app.py's `process_video()`
      business logic (the parts that are not Streamlit UI/session
      state), so the POST /api/transcript/process route can expose it
      over HTTP with identical behavior.
"""

import re

from utils.exceptions import InvalidYouTubeURLError
from utils.text_cleaning import clean_transcript_text

from services.youtube_service import fetch_transcript
from services.embedding_service import (
    chunk_transcript,
    create_and_store_embeddings,
    video_already_processed,
    get_collection_name,
)


# Regex patterns covering the common YouTube URL formats:
#   https://www.youtube.com/watch?v=VIDEO_ID
#   https://youtu.be/VIDEO_ID
#   https://www.youtube.com/embed/VIDEO_ID
#   https://www.youtube.com/shorts/VIDEO_ID
#   Plain 11-character video IDs
_YOUTUBE_URL_PATTERNS = [
    r"(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})",
    r"(?:youtu\.be\/)([a-zA-Z0-9_-]{11})",
    r"(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})",
    r"(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})",
    r"^([a-zA-Z0-9_-]{11})$",
]


def extract_video_id(youtube_url: str) -> str:
    """
    Extract the 11-character YouTube video ID from a given URL.

    Args:
        youtube_url: A YouTube URL (or raw video ID) provided by the user.

    Returns:
        The extracted video ID.

    Raises:
        InvalidYouTubeURLError: If no valid video ID could be extracted.
    """
    if not youtube_url or not youtube_url.strip():
        raise InvalidYouTubeURLError("Please provide a YouTube URL.")

    cleaned_url = youtube_url.strip()

    for pattern in _YOUTUBE_URL_PATTERNS:
        match = re.search(pattern, cleaned_url)
        if match:
            return match.group(1)

    raise InvalidYouTubeURLError(
        "The provided URL does not appear to be a valid YouTube video link."
    )


def get_processed_transcript(youtube_url: str) -> dict:
    """
    High-level helper that extracts the video ID, fetches the transcript,
    and returns both the raw and cleaned versions along with metadata.

    Args:
        youtube_url: The YouTube URL provided by the user.

    Returns:
        A dictionary with keys: video_id, raw_transcript, cleaned_transcript, duration.

    Raises:
        InvalidYouTubeURLError, TranscriptNotFoundError, TranscriptFetchError
    """
    video_id = extract_video_id(youtube_url)
    raw_transcript, duration = fetch_transcript(video_id)
    cleaned_transcript = clean_transcript_text(raw_transcript)

    return {
        "video_id": video_id,
        "raw_transcript": raw_transcript,
        "cleaned_transcript": cleaned_transcript,
        "duration": duration,
    }


def process_video_pipeline(youtube_url: str) -> dict:
    """
    Full ingestion pipeline for POST /api/transcript/process, ported
    from app.py's `process_video()` (the business-logic portion only —
    st.status/st.write progress narration and st.session_state
    mutation were UI/session concerns specific to Streamlit and are
    not part of this service; the calling route returns the same
    information as a single JSON response instead).

    Steps (unchanged from the original):
        1. Extract video ID and fetch transcript.
        2. Clean the transcript text.
        3. Chunk the cleaned transcript.
        4. If this video's chunks are not already stored in ChromaDB,
           generate and store embeddings for them.

    Returns:
        A dict with: video_id, raw_transcript, cleaned_transcript,
        duration, num_chunks, transcript_length, collection_name,
        already_processed.

    Raises:
        InvalidYouTubeURLError, TranscriptNotFoundError,
        TranscriptFetchError, EmbeddingGenerationError, VectorStoreError
    """
    result = get_processed_transcript(youtube_url)
    video_id = result["video_id"]
    cleaned_transcript = result["cleaned_transcript"]

    already_done = video_already_processed(video_id)

    chunks = chunk_transcript(cleaned_transcript)
    num_chunks = len(chunks)

    if not already_done:
        create_and_store_embeddings(video_id, chunks)

    return {
        "video_id": video_id,
        "raw_transcript": result["raw_transcript"],
        "cleaned_transcript": cleaned_transcript,
        "duration": result.get("duration", 0),
        "num_chunks": num_chunks,
        "transcript_length": len(cleaned_transcript),
        "collection_name": get_collection_name(video_id),
        "already_processed": already_done,
    }
