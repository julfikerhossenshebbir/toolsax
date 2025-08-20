'use server';

import { updateGlobalNotifications } from '@/lib/firebase';
import type { Notification } from '../types';

export async function sendNotification(notifications: Notification[]): Promise<{ success: boolean; error?: string }> {
  try {
    // This is an admin-only action, but extra validation can be added here
    // e.g. check the role of the user invoking this server action
    await updateGlobalNotifications(notifications);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return { success: false, error: 'Failed to update notifications in the database.' };
  }
}
