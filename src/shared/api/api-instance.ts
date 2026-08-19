import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
console.log(import.meta.env.VITE_API_URL);
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

interface RefreshQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let accsessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accsessToken = token;
}

export function getAccessToken() {
  return accsessToken;
}

axiosInstance.interceptors.request.use((config) => {
  if (accsessToken) {
    config.headers.Authorization = `Bearer ${accsessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axiosInstance.post<{ accessToken: string }>(
        "/auth/refresh",
      );
      const newToken = data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
