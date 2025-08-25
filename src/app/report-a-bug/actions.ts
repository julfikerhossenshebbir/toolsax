
'use server';

import 'dotenv/config'
import { z } from 'zod';
import type { UserData } from '@/lib/types';
import { submitBugReport } from '@/lib/firebase';

const reportSchema = z.object({
  tool: z.string(),
  description: z.string(),
  user: z.object({
      uid: z.string(),
      name: z.string(),
      email: z.string(),
  })
});

type ReportData = z.infer<typeof reportSchema>;

export async function submitBugReportAction(data: ReportData): Promise<{ success: boolean; error?: string }> {
  try {
    await submitBugReport(data);
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting bug report:', error);
    return { success: false, error: 'Failed to submit bug report.' };
  }
}
