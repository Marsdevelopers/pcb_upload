export async function sendTelegramNotification(submission: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const message = `
🔔 *New PCB Submission*

👤 *Name:* ${submission.name}
📧 *Email:* ${submission.email}
📱 *Phone:* ${submission.phone}
📝 *Notes:* ${submission.notes || 'None'}
📎 *File:* ${submission.file_name}
⏰ *Time:* ${new Date().toLocaleString()}

🔗 [View Admin Panel](https://your-domain.vercel.app/admin)
  `;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}