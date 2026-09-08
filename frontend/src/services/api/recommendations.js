import apiClient from "./axiosClient";

/**
 * Placeholder service for recommendations.py's generate_recommendations().
 */
export async function generateRecommendations(summary, notes, duration) {
  return apiClient.post("/recommendations/generate", { summary, notes, duration });
}

export default { generateRecommendations };
