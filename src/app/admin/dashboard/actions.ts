
'use server';

import { updateGlobalNotifications, updateAdSettings, saveAdvertisement, deleteAdvertisement, saveTool, deleteTool, updateToolsOrder, approveSubmittedAd, rejectSubmittedAd } from '@/lib/firebase';
import type { Notification, Tool } from '../types';

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

export async function saveToolAction(tool: Tool): Promise<{ success: boolean; error?: string }> {
  try {
    await saveTool(tool);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving tool:', error);
    return { success: false, error: 'Failed to save tool.' };
  }
}

export async function deleteToolAction(toolId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteTool(toolId);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting tool:', error);
    return { success: false, error: 'Failed to delete tool.' };
  }
}

export async function updateToolsOrderAction(tools: Tool[]): Promise<{ success: boolean; error?: string }> {
    try {
        await updateToolsOrder(tools);
        return { success: true };
    } catch (error: any) {
        console.error('Error updating tools order:', error);
        return { success: false, error: 'Failed to update tools order.' };
    }
}
