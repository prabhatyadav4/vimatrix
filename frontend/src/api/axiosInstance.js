import axios from "axios";
import { store } from "../app/store.js";
import { login, logout } from "../app/slices/authSlice.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // send cookies (refresh token)
});

// ── Request: attach access token ──────────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: handle 401 with silent token refresh ────────────────────────────
// New Concept: token refresh flow
// When access token expires (401) → call /refresh-token endpoint
// If refresh succeeds → update Redux → retry the original request
// If refresh fails → logout user
//
// "_retry" flag on the config object prevents infinite loops:
// without it, the retried request could also 401 → trigger refresh again → loop

let isRefreshing = false;
let refreshQueue = []; // queue of requests waiting for new token

const processQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint — sends httpOnly cookie automatically
        const res = await axiosInstance.post("/users/refresh-token");
        const newToken = res.data.data.accessToken;

        // Update Redux store
        store.dispatch(
          login({
            user: store.getState().auth.user,
            accessToken: newToken,
          }),
        );

        // Update header for this retry
        original.headers.Authorization = `Bearer ${newToken}`;

        // Let queued requests proceed with new token
        processQueue(null, newToken);

        return axiosInstance(original); // retry original request
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
