'use server';

import { z } from 'zod';

const formSchema = z.object({
  tool: z.string(),
  description: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export async function sendTelegramMessage(data: FormData): Promise<{ success: boolean; error?: string }> {
  const { tool, description } = data;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram bot token or chat ID is not configured.');
    return { success: false, error: 'Server configuration error.' };
  }

  const message = `
🐞 *New Bug Report* 🐞

*Tool:*
\`${tool}\`

*Description:*
\`\`\`
${description}
\`\`\`
  `;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
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

    const result = await response.json();

    if (result.ok) {
      return { success: true };
    } else {
      console.error('Telegram API error:', result.description);
      return { success: false, error: `Failed to send report: ${result.description}` };
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return { success: false, error: 'Could not connect to the notification service.' };
  }
}
