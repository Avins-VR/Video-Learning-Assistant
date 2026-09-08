"""
services/youtube_service.py

Low-level YouTube interaction: fetching the raw transcript (via
yt-dlp) for a given video ID. This is a direct port of
transcript.py's `fetch_transcript()` function from the original
Streamlit project — the yt-dlp options, subtitle-track selection
(English manual captions, falling back to auto captions), JSON3
parsing, and timestamp formatting are all unchanged.
"""

import time

import yt_dlp
import requests

from utils.exceptions import (
    TranscriptNotFoundError,
    TranscriptFetchError,
)


def fetch_transcript(video_id: str):
    """
    Fetch the raw transcript text (with inline [MM:SS] timestamps) and
    the video duration (in seconds) for a given YouTube video ID.

    Returns:
        (transcript_text, duration) tuple.

    Raises:
        TranscriptNotFoundError: if no English subtitles/captions exist,
            or the fetched transcript is empty.
        TranscriptFetchError: for any other failure while extracting
            video info or downloading/parsing the subtitle track.
    """
    try:
        url = f"https://www.youtube.com/watch?v={video_id}"

        ydl_opts = {
            "skip_download": True,
            "quiet": True,
            "js_runtimes": {
                "deno": {}
            },
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            duration = info.get("duration", 0)
        subtitles = info.get("subtitles", {})

        if "en" not in subtitles:

            subtitles = info.get("automatic_captions", {})

        if "en" not in subtitles:
            raise TranscriptNotFoundError(
                "English subtitles not available."
            )
        json_url = None

        for subtitle in subtitles["en"]:
            if subtitle["ext"] == "json3":
                json_url = subtitle["url"]
                break

        if not json_url:
            raise TranscriptNotFoundError(
                "JSON subtitles not available."
            )

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        }

        time.sleep(2)

        response = requests.get(
            json_url,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        data = response.json()

        transcript_parts = []

        for event in data.get("events", []):

            if "segs" not in event:
                continue

            start_seconds = int(event.get("tStartMs", 0) / 1000)

            minutes = start_seconds // 60
            seconds = start_seconds % 60

            timestamp = f"[{minutes:02d}:{seconds:02d}]"

            text = "".join(
                seg.get("utf8", "")
                for seg in event["segs"]
            ).strip()

            if text:
                transcript_parts.append(
                    f"{timestamp} {text}"
                )

        transcript_text = "\n".join(transcript_parts)

        if not transcript_text.strip():
            raise TranscriptNotFoundError(
                "Transcript is empty."
            )

        return transcript_text, duration

    except TranscriptNotFoundError:
        raise

    except Exception as exc:
        raise TranscriptFetchError(
            f"Failed to fetch transcript: {str(exc)}"
        )
