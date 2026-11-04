import { apiClient } from '@/lib/api-client';
import type { ContactMessagePayload } from '@/features/contact/api/submit-contact';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * ContactService — adapter for contact message API calls.
 */
export const contactService = {
  submit(payload: ContactMessagePayload): Promise<{ data: void }> {
    return apiClient.post<void>('/contact', payload);
  },

  getAll(): Promise<{ data: ContactMessage[] }> {
    return apiClient.get<ContactMessage[]>('/contact');
  },

  markAsRead(id: string): Promise<{ data: ContactMessage }> {
    return apiClient.patch<ContactMessage>(`/contact/${id}/read`, {});
  },
};
