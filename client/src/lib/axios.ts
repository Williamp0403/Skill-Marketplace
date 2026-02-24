import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para almacenar la función que obtiene el token de Clerk
let getTokenFn: (() => Promise<string | null>) | null = null;

// Esta función se llama desde un componente React para "registrar" el getToken de Clerk
export const setGetTokenFn = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};

// Interceptor: antes de cada request, obtiene el token fresco de Clerk
axiosInstance.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
