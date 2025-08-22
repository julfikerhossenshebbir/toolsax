'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase-admin/auth';
import { saveSubmittedAd } from '@/lib/firebase';
import type { SubmittedAd } from '@/app/admin/types';


export async function submitAdAction(
    data: Omit<SubmittedAd, 'id' | 'status' | 'submissionDate'>
): Promise<{ success: boolean; error?: string }> {
    try {
        // Validation can be done here with Zod if needed
        await saveSubmittedAd(data);
        return { success: true };
    } catch (error: any) {
        console.error('Error submitting ad:', error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
}
