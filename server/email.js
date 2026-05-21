import nodemailer from 'nodemailer';

export async function sendContactEmail({ name, email, subject, message, date }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpTo = process.env.SMTP_TO || smtpUser;

  // Safety check to verify SMTP credentials are not placeholders
  if (!smtpUser || !smtpPass || smtpPass.includes('placeholder') || smtpUser.includes('your_gmail')) {
    console.warn('[SMTP] Skipping email notification: SMTP credentials are not configured or still placeholders in .env.');
    return false;
  }

  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email content formatting (using rich CSS design for a professional hacker alert style)
    const mailOptions = {
      from: smtpUser,
      to: smtpTo,
      replyTo: email,
      subject: `[Cyber Inquiry] ${subject}`,
      text: `
New Portfolio Inquiry Received!
-----------------------------------
Date: ${date}
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <div style="font-family: monospace, sans-serif; background-color: #030014; color: #ffffff; padding: 25px; border-radius: 15px; border: 1px solid #00f0ff; max-width: 600px; margin: 0 auto; box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);">
          <div style="text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #00f0ff; margin: 0; font-size: 20px; text-shadow: 0 0 8px rgba(0,240,255,0.4);">
              root@sushan:~# cat new_message.log
            </h2>
          </div>
          <div style="background-color: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
            <p style="margin: 8px 0;"><span style="color: #a855f7; font-weight: bold;">TIMESTAMP:</span> ${date}</p>
            <p style="margin: 8px 0;"><span style="color: #a855f7; font-weight: bold;">SENDER:</span> ${name} &lt;${email}&gt;</p>
            <p style="margin: 8px 0;"><span style="color: #a855f7; font-weight: bold;">SUBJECT:</span> ${subject}</p>
          </div>
          <div style="background-color: rgba(0,240,255,0.02); padding: 15px; border-radius: 10px; border-left: 3px solid #00f0ff; white-space: pre-wrap; line-height: 1.6; color: #e5e7eb;">
${message}
          </div>
          <div style="margin-top: 25px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
            This email was auto-generated from your personal website. Log in at /admin to manage your mailbox.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP] Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('[SMTP] Failed to send contact email notification:', error);
    return false;
  }
}
