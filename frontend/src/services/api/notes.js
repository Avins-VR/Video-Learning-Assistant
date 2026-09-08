import apiClient from "./axiosClient";

/**
 * Placeholder service for notes.py's generate_key_notes().
 */
export async function generateKeyNotes(videoId) {
  return apiClient.post("/notes/generate", { video_id: videoId });
}

export default { generateKeyNotes };
