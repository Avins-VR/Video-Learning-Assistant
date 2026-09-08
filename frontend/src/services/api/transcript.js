import apiClient from "./axiosClient";

/**
 * Placeholder service for transcript.py's get_processed_transcript().
 * Mirrors the shape returned by the Python backend:
 * { video_id, raw_transcript, cleaned_transcript, duration }
 */
export async function getProcessedTranscript(youtubeUrl) {
  // return (await apiClient.post("/transcript/process", { youtube_url: youtubeUrl })).data;
  return apiClient.post("/transcript/process", { youtube_url: youtubeUrl });
}

export default { getProcessedTranscript };
