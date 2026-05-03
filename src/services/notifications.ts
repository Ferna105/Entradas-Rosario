import { apiClient } from "./api";

export type NotificationType =
  | "purchase_approved"
  | "purchase_rejected"
  | "new_sale"
  | "scanner_accepted"
  | "event_published";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export const notificationsService = {
  async list(limit?: number): Promise<Notification[]> {
    const params = limit ? { limit: String(limit) } : undefined;
    return apiClient.get<Notification[]>("/notifications", { params });
  },

  async unreadCount(): Promise<number> {
    const res = await apiClient.get<{ count: number }>(
      "/notifications/unread-count"
    );
    return res.count;
  },

  async markRead(id: number): Promise<void> {
    return apiClient.post<void>(`/notifications/${id}/read`, {});
  },

  async markAllRead(): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>("/notifications/read-all", {});
  },
};
