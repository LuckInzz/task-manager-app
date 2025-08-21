/**
 * O formato dos dados que o frontend envia para o endpoint de registo.
 * Corresponde ao `UserRegisterDTO.java`.
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

/**
 * O formato dos dados que o backend retorna após um registo bem-sucedido.
 * Corresponde ao `UserResponseDTO.java`.
 */
export interface UserResponse {
    id: number;
    username: string;
    email: string;
}

/**
 * O formato dos dados que o frontend envia para o endpoint de login.
 * Corresponde ao `LoginRequestDTO.java`.
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * O formato dos dados que o backend retorna após um login bem-sucedido.
 * Corresponde ao `LoginResponseDTO.java`.
 */
export interface LoginResponse {
    token: string;
}
