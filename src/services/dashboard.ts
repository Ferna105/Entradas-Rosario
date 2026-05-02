import { apiClient } from "./api";

export interface DashboardStats {
  revenueThisMonth: number;
  ticketsSold: number;
  activeEvents: number;
  pendingPayout: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>("/dashboard/stats");
  },
};
