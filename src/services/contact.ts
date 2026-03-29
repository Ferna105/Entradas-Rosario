import { apiClient } from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export async function sendContactMessage(
  payload: ContactPayload
): Promise<{ ok: boolean }> {
  return apiClient.post<{ ok: boolean }, ContactPayload>("/contact", payload);
}
