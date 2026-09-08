import apiClient from "./axiosClient";

/**
 * Placeholder service for concept_map.py's generate_concept_map().
 * Expected response shape: { tree, mermaid, stats }
 */
export async function generateConceptMap(transcript, summary, notes) {
  return apiClient.post("/concept-map/generate", { transcript, summary, notes });
}

export default { generateConceptMap };
