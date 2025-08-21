import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../types/Auth.tsx';

/**
 * Tenta fazer login de um utilizador.
 * @param credentials - O email e a password do utilizador.
 * @returns A resposta do login, contendo o token JWT.
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
};

/**
 * Regista um novo utilizador.
 * @param userData - O username, email e password para a nova conta.
 */
export const register = async (userData: RegisterRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/auth/register', userData);
    return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
}