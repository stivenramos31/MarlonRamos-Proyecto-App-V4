import axios from "axios";

export const API_URL = "https://api-ecommerce-5aby.onrender.com"

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Callback que conectará AuthContext (clearSession) sin crear dependencias circulares
let onUnauthorizedCallback: (() => void | Promise<void>) | null = null;

export const setUnauthorizedHandler = (callback: () => void | Promise<void>) => {
  onUnauthorizedCallback = callback;
};

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    // Si es 401 y NO es el endpoint de login, cerramos sesión automáticamente
    if (error.response?.status === 401 && !isLoginRequest) {
      console.log("Interceptor 401: Token inválido o expirado. Cerrando sesión...");
      if (onUnauthorizedCallback) {
        await onUnauthorizedCallback();
      }
    }

    return Promise.reject(error);
  }
);