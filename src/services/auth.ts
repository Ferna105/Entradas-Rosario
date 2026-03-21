import { apiClient } from './api';
import { AuthResponse, User } from '@/types/user';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  type?: 'buyer' | 'seller' | 'scanner';
}

interface LoginParams {
  email: string;
  password: string;
}

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const authService = {
  async register(params: RegisterParams): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', params);
    this.saveTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', params);
    this.saveTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) throw new Error('No refresh token');

    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    this.saveTokens(response.accessToken, response.refreshToken);
    return response;
  },

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
