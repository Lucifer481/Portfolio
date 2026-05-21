import { config } from 'dotenv';
config();

export async function sendContactEmail({ name, email, subject, message, date }) {
  const resendApiKey = process.env.SMTP_PASSWORD;
  const resendFrom = process.env.SMTP_USER; // verified sender address
  const emailRecipient = process.env.SMTP_TO || resendFrom;

  if (!resendApiKey || !resendFrom || !emailRecipient) {
    console.warn('[Resend] Missing configuration – email not sent.');
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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: emailRecipient,
        reply_to: email,
        subject: `[Contact] ${subject}`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Resend] Failed to send email:', err);
      return false;
    }
    const data = await response.json();
    console.log('[Resend] Email sent, id:', data?.id);
    return true;
  } catch (e) {
    console.error('[Resend] Unexpected error while sending email:', e);
    return false;
  }
}


export async function sendContactEmail({ name, email, subject, message, date }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM; // verified sender address
  // Destination address for the email (your Gmail). Fallback to sender if not set.
  const emailRecipient = process.env.EMAIL_RECIPIENT || resendFrom;

  // Ensure the essential Resend configuration is present.
  if (!resendApiKey || !resendFrom) {
    console.warn('[Resend] Missing RESEND_API_KEY or RESEND_FROM – email not sent.');
    return false;
  }


  // Ensure the essential Resend configuration is present.
  if (!resendApiKey || !resendFrom) {
    console.warn('[Resend] Missing RESEND_API_KEY or RESEND_FROM – email not sent.');
    return false;
  }

  // Plain‑text version of the email (kept identical to previous implementation)
  const textBody = `
New Portfolio Inquiry Received!
-----------------------------------
Date: ${date}
From: ${name} <${email}>
Subject: ${subject}

Message:
${message}
`;

  // HTML version with the same visual style used previously
  const htmlBody = `
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
  `;

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: recipient,
      reply_to: email,
      subject: `[Cyber Inquiry] ${subject}`,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error('[Resend] Failed to send email:', error);
      return false;
    }

    console.log('[Resend] Email sent, id:', data?.id);
    return true;
  } catch (e) {
    console.error('[Resend] Unexpected error while sending email:', e);
    return false;
  }
}
