import { config } from 'dotenv';
import sgMail from '@sendgrid/mail';

config();

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  date,
}) {
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const toEmail = process.env.SENDGRID_TO_EMAIL || fromEmail;

  if (!sendgridApiKey || !fromEmail || !toEmail) {
    console.warn('[SendGrid] Missing configuration.');
    return false;
  }

  sgMail.setApiKey(sendgridApiKey);

  const textBody = `
New Portfolio Inquiry

Date: ${date}
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}
`;

  const htmlBody = `
    <div style="font-family:sans-serif;padding:20px;">
      <h2>New Portfolio Inquiry</h2>

      <p><strong>Date:</strong> ${date}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>

      <hr />

      <p>${message}</p>
    </div>
  `;

  try {
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      text: textBody,
      html: htmlBody,
    });

    console.log('[SendGrid] Email sent successfully');

    return true;
  } catch (error) {
    console.error('[SendGrid] Error sending email');

    if (error.response) {
      console.error(error.response.body);
    } else {
      console.error(error.message);
    }

    return false;
  }
}
