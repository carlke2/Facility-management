import axios from "axios";
import { storage } from "./storage";

// This tries to use it if present; otherwise fallback.
let baseURL = " https://boardroom-exii.onrender.com";
try {
  // eslint-disable-next-line global-require
  const cfg = require("../config");
  baseURL = cfg?.API_URL || cfg?.BASE_URL || baseURL;
} catch {
  // ignore
}

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request (from storage)
http.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config?.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

// Global 401 handling
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    // If token expired / invalid — log out on frontend
    if (status === 401) {
      storage.clear();

      // Avoid hard reload loops; send user to login only if they are in the protected app area
      if (typeof window !== "undefined") {
        const path = window.location.pathname || "";
        if (path.startsWith("/app")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(err);
  }
);
