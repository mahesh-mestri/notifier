import api from '../api';
import {
    LoginPayload,
    SignupPayload,
    AuthResponse,
} from '../../types/auth.types';


export const loginUser = async (
    payload: LoginPayload,
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        '/v1/auth/login',
        payload,
        { skipAuth: true },
    );

    return response.data;
};

export const signupUser = async (
    payload: SignupPayload,
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        '/v1/auth/signup',
        payload,
        { skipAuth: true },
    );

    return response.data;
};