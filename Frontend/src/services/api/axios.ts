import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
    withCredentials: true,
});

function getCsrfToken(): string | null {
    const cookies = document.cookie.split("; ");

    const csrfCookie = cookies.find(
        (cookie) =>
            cookie.startsWith("csrf_token=")
    );

    if (!csrfCookie) {
        return null;
    }

    return decodeURIComponent(
        csrfCookie.substring("csrf_token=".length)
    );
}

api.interceptors.request.use(
    (config) => {
        const method =
            config.method?.toUpperCase();

        const requiresCsrf =
            method === "POST" ||
            method === "PUT" ||
            method === "PATCH" ||
            method === "DELETE";

        if (requiresCsrf) {
            const csrfToken = getCsrfToken();

            if (csrfToken) {
                config.headers.set(
                    "X-CSRF-Token",
                    csrfToken
                );
            }
        }

        return config;
    }
);

let isRefreshing = false;

type QueueItem = {
    resolve: () => void;
    reject: (error: unknown) => void;
};

let refreshQueue: QueueItem[] = [];

function processRefreshQueue(
    error: unknown = null
) {
    refreshQueue.forEach(
        ({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        }
    );

    refreshQueue = [];
}

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };
        const isSignInRequest =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/token");

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry ||
            isSignInRequest ||
            originalRequest?.url?.includes(
                "/auth/refresh"
            )
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<void>(
                (resolve, reject) => {
                    refreshQueue.push({
                        resolve,
                        reject,
                    });
                }
            ).then(() => {
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post("/auth/refresh");

            processRefreshQueue();

            return api(originalRequest);
        } catch (refreshError) {
            processRefreshQueue(
                refreshError
            );

            return Promise.reject(
                refreshError
            );
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;