const defaultApiUrl = import.meta.env.PROD
  ? "https://api.bostondumplings.com"
  : "http://localhost:5000";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || defaultApiUrl
).replace(/\/+$/, "");
