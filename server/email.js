import { config } from 'dotenv';

config();

export async function sendContactEmail({ name, email, subject, message, date }) {
  // SMTP configuration from environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const emailRecipient = process.env.SMTP_TO || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !emailRecipient) {
    console.warn('[SMTP] Missing configuration – email not sent.');
    return false;
  }

  const textBody = `
New Portfolio Inquiry Received!
-----------------------------------
Date: ${date}
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}
`;

  const htmlBody = `
    <div style="font-family: monospace, sans-serif; background-color:#030014; color:#fff; padding:25px; border-radius:15px; border:1px solid #00f0ff; max-width:600px; margin:auto; box-shadow:0 0 15px rgba(0,240,255,.2);">
      <div style="text-align:center; border-bottom:2px solid #a855f7; padding-bottom:15px; margin-bottom:20px;">
        <h2 style="color:#00f0ff; margin:0; font-size:20px; text-shadow:0 0 8px rgba(0,240,255,.4);">root@sushan:~# cat new_message.log</h2>
      </div>
      <div style="background:rgba(255,255,255,.03); padding:15px; border-radius:10px; border:1px solid rgba(255,255,255,.05); margin-bottom:20px;">
        <p style="margin:8px 0;"><span style="color:#a855f7; font-weight:bold;">TIMESTAMP:</span> ${date}</p>
        <p style="margin:8px 0;"><span style="color:#a855f7; font-weight:bold;">SENDER:</span> ${name} &lt;${email}&gt;</p>
        <p style="margin:8px 0;"><span style="color:#a855f7; font-weight:bold;">SUBJECT:</span> ${subject}</p>
      </div>
      <div style="background:rgba(0,240,255,.02); padding:15px; border-radius:10px; border-left:3px solid #00f0ff; white-space:pre-wrap; line-height:1.6; color:#e5e7eb;">
        ${message}
      </div>
      <div style="margin-top:25px; text-align:center; font-size:11px; color:#6b7280; border-top:1px solid rgba(255,255,255,.05); padding-top:15px;">
        This email was auto-generated from your personal website.
      </div>
    </div>
  `;

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpUser,
      to: emailRecipient,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: textBody,
      html: htmlBody,
    });
    console.log('[SMTP] Email sent successfully');
    return true;
  } catch (e) {
    console.error('[SMTP] Unexpected error while sending email:', e);
    return false;
  }
}
