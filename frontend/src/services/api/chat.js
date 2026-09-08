import apiClient from "./axiosClient";

/**
 * Placeholder service for rag.py's answer_doubt() / query_video_chunks().
 */
export async function askDoubt(videoId, question) {
  return apiClient.post("/chat/ask", { video_id: videoId, question });
}

export default { askDoubt };
