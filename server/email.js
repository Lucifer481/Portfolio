import nodemailer from 'nodemailer';
import 'dotenv/config';

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  date,
}) {
  // SMTP configuration from environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailRecipient = process.env.SMTP_TO || smtpUser;

  // Check required variables
  if (!smtpHost || !smtpUser || !smtpPass || !emailRecipient) {
    console.warn('[SMTP] Missing configuration – email not sent.');
    return false;
  }

  // Plain text email body
  const textBody = `
New Portfolio Inquiry Received!
-----------------------------------

Date: ${date}
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}
`;

  // HTML email body
  const htmlBody = `
    <div style="font-family: monospace, sans-serif; background-color:#030014; color:#fff; padding:25px; border-radius:15px; border:1px solid #00f0ff; max-width:600px; margin:auto; box-shadow:0 0 15px rgba(0,240,255,.2);">

      <div style="text-align:center; border-bottom:2px solid #a855f7; padding-bottom:15px; margin-bottom:20px;">
        <h2 style="color:#00f0ff; margin:0; font-size:20px;">
          root@sushan:~# cat new_message.log
        </h2>
      </div>

      <div style="background:rgba(255,255,255,.03); padding:15px; border-radius:10px; margin-bottom:20px;">

        <p>
          <strong style="color:#a855f7;">TIMESTAMP:</strong>
          ${date}
        </p>

        <p>
          <strong style="color:#a855f7;">SENDER:</strong>
          ${name} &lt;${email}&gt;
        </p>

        <p>
          <strong style="color:#a855f7;">SUBJECT:</strong>
          ${subject}
        </p>

      </div>

      <div style="background:rgba(0,240,255,.02); padding:15px; border-radius:10px; border-left:3px solid #00f0ff; white-space:pre-wrap; line-height:1.6; color:#e5e7eb;">

        ${message}

      </div>

      <div style="margin-top:25px; text-align:center; font-size:11px; color:#6b7280; border-top:1px solid rgba(255,255,255,.05); padding-top:15px;">

        This email was auto-generated from your portfolio website.

      </div>
    </div>
  `;

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,

      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: smtpUser,
      to: emailRecipient,

      // lets you directly reply to sender
      replyTo: email,

      subject: `[Portfolio Contact] ${subject}`,

      text: textBody,
      html: htmlBody,
    });

    console.log('[SMTP] Email sent successfully');
    console.log(info);

    return true;
  } catch (error) {
    console.error('[SMTP] Failed to send email:', error);
    return false;
  }
}
