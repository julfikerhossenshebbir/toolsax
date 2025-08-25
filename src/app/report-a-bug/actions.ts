
'use server';

import 'dotenv/config'
import { z } from 'zod';
import type { UserData } from '@/lib/types';

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
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram bot token or chat ID is not configured.");
        return { success: false, error: 'Notification service is not configured.' };
    }

    const message = `
*New Bug Report!* 🐞

*Tool:* ${data.tool}
*User:* ${data.user.name} (${data.user.email})
*Description:*
${data.description}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
        }),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting bug report:', error);
    return { success: false, error: 'Failed to submit bug report.' };
  }
}

