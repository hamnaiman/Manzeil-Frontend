import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("customerToken");
  if (token) config.headers.Authorization = "Bearer " + token;
  // Large media uploads need time for Cloudinary processing.
  if (config.data instanceof FormData) config.timeout = 180000;
  return config;
});
export default api;
