import axios from "axios";

/**
 * Shared Axios instance. The base URL will point at the Flask backend
 * once it exists; for now every request goes through this client so
 * swapping the mock implementations for real calls later is a one-line
 * change per service file.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
