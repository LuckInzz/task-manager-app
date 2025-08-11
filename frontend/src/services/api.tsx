import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Cria uma instância do Axios com uma configuração base.
const api = axios.create({
    // A URL base da nossa API no backend.
    baseURL: API_BASE_URL
});

export default api;