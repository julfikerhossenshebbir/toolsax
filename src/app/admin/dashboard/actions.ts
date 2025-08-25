
'use server';

import { updateGlobalNotifications, saveTool, deleteTool, updateToolsOrder, submitVipRequest, approveVipRequest, rejectVipRequest, savePaymentMethod, deletePaymentMethod, submitBugReport, deleteBugReport } from '@/lib/firebase';
import type { Notification, Tool, VipRequest, PaymentMethod, BugReport } from '../types';

export async function sendNotification(notifications: Notification[]): Promise<{ success: boolean; error?: string }> {
  try {
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

export async function submitVipRequestAction(requestData: Omit<VipRequest, 'status' | 'timestamp'>): Promise<{ success: boolean; error?: string }> {
    try {
        await submitVipRequest(requestData);
        return { success: true };
    } catch (error: any) {
        console.error('Error submitting VIP request:', error);
        return { success: false, error: error.message || 'Failed to submit VIP request.' };
    }
}

export async function approveVipRequestAction(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    await approveVipRequest(uid);
    return { success: true };
  } catch (error: any) {
    console.error('Error approving VIP request:', error);
    return { success: false, error: 'Failed to approve VIP request.' };
  }
}

export async function rejectVipRequestAction(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    await rejectVipRequest(uid);
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting VIP request:', error);
    return { success: false, error: 'Failed to reject VIP request.' };
  }
}


export async function savePaymentMethodAction(method: PaymentMethod): Promise<{ success: boolean; error?: string }> {
  try {
    await savePaymentMethod(method);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving payment method:', error);
    return { success: false, error: 'Failed to save payment method.' };
  }
}

export async function deletePaymentMethodAction(methodId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deletePaymentMethod(methodId);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting payment method:', error);
    return { success: false, error: 'Failed to delete payment method.' };
  }
}

export async function submitBugReportAction(reportData: Pick<BugReport, 'tool' | 'description'> & { user: Pick<UserData, 'uid' | 'name' | 'email'> }): Promise<{ success: boolean; error?: string }> {
    try {
        await submitBugReport(reportData);
        return { success: true };
    } catch (error: any) {
        console.error('Error submitting bug report:', error);
        return { success: false, error: 'Failed to submit bug report.' };
    }
}

export async function deleteBugReportAction(reportId: string): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteBugReport(reportId);
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting bug report:', error);
        return { success: false, error: 'Failed to delete bug report.' };
    }
}
