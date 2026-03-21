import { apiClient } from './api';

export const mpService = {
  async getAuthUrl(): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>('/mp/auth-url');
  },

  async getStatus(): Promise<{ connected: boolean; mpUserId: string | null }> {
    return apiClient.get('/mp/status');
  },

  async disconnect(): Promise<void> {
    return apiClient.post('/mp/disconnect', {});
  },
};
