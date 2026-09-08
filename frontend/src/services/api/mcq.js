import apiClient from "./axiosClient";

/**
 * Placeholder service for mcq.py's generate_mcqs().
 */
export async function generateMcqs(videoId, duration) {
  return apiClient.post("/mcq/generate", { video_id: videoId, duration });
}

export default { generateMcqs };
