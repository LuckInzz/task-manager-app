import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Cria uma instância do Axios com uma configuração base.
const api = axios.create({
    // A URL base da nossa API no backend.
    baseURL: API_BASE_URL
});

api.interceptors.request.use(
    (config) => {
        // 1. Pega no token que guardámos no localStorage após o login.
        const token = localStorage.getItem('authToken');

        // 2. Se o token existir, adiciona-o ao cabeçalho 'Authorization'.
        if (token) {
            // O formato "Bearer <token>" é o padrão que o Spring Security espera.
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 3. Retorna a configuração modificada para que a requisição possa continuar.
        return config;
    },
    (error) => {
        // Se ocorrer um erro durante a configuração, rejeita a promessa.
        return Promise.reject(error);
    }
);

export default api;