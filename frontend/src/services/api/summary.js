import apiClient from "./axiosClient";

/**
 * Placeholder service for summary.py's generate_summary().
 */
export async function generateSummary(videoId, duration) {
  return apiClient.post("/summary/generate", { video_id: videoId, duration });
}

export default { generateSummary };
