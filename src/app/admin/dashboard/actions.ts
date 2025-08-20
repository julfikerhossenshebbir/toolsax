'use server';

import { updateGlobalNotifications, updateAdSettings, saveAdvertisement, deleteAdvertisement } from '@/lib/firebase';
import type { Notification, AdSettings, Advertisement } from '../types';

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


export async function saveAdSettingsAction(settings: AdSettings): Promise<{ success: boolean; error?: string }> {
  try {
    await updateAdSettings(settings);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving ad settings:', error);
    return { success: false, error: 'Failed to update ad settings.' };
  }
}


export async function saveAdvertisementAction(ad: Advertisement): Promise<{ success: boolean; error?: string }> {
  try {
    await saveAdvertisement(ad);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving advertisement:', error);
    return { success: false, error: 'Failed to save advertisement.' };
  }
}

export async function deleteAdvertisementAction(adId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteAdvertisement(adId);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting advertisement:', error);
    return { success: false, error: 'Failed to delete advertisement.' };
  }
}
