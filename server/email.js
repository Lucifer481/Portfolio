import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  date,
}) {
  try {
    const response = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.RESEND_TO,
      reply_to: email,
      subject: `[Portfolio Contact] ${subject}`,

      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>New Portfolio Message</h2>

          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <hr />

          <p>${message}</p>
        </div>
      `,
    });

    console.log('[Resend] Email sent:', response);

    return true;
  } catch (error) {
    console.error('[Resend] Email failed:', error);

    return false;
  }
}
