/**
 * Envoi d'e-mails de notification via l'API Resend (https://resend.com).
 * Volontairement sans dépendance : un simple fetch suffit et évite d'alourdir
 * le bundle serverless sur Vercel.
 *
 * Configuration requise (variables d'environnement) :
 *   RESEND_API_KEY  — clé API (re:…)
 *   RESEND_FROM     — expéditeur vérifié, ex. "Landmark Global <no-reply@votredomaine.com>"
 *
 * Sans RESEND_API_KEY, l'application fonctionne normalement mais n'envoie
 * aucun e-mail (le suivi reste utilisable).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface StatusEmailInput {
  to: string;
  trackingCode: string;
  recipient: string;
  destination: string;
  status: string;
}

const STATUS_LABELS: Record<string, { label: string; description: string }> = {
  CREATED: { label: "Label created", description: "Your parcel has been registered in our system." },
  IN_TRANSIT: { label: "In transit", description: "Your parcel is on its way to the destination country." },
  CUSTOMS: { label: "In customs", description: "Your parcel is being processed by customs." },
  OUT_FOR_DELIVERY: { label: "Out for delivery", description: "Your parcel will be delivered today." },
  DELIVERED: { label: "Delivered", description: "Your parcel has been delivered. We hope everything arrived in perfect condition." },
  EXCEPTION: { label: "Delivery exception", description: "An issue occurred with your delivery. Our team is on it — no action is required from you at this stage." },
};

export function isEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export interface EmailResult {
  sent: boolean;
  error?: string;
}

export async function sendStatusChangeEmail(input: StatusEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return { sent: false, error: "RESEND_API_KEY / RESEND_FROM not configured" };
  }

  const meta = STATUS_LABELS[input.status] ?? {
    label: input.status.replace(/_/g, " ").toLowerCase(),
    description: "The status of your parcel has been updated.",
  };

  const trackUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/en/tracking?code=${encodeURIComponent(input.trackingCode)}`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f3f3f3;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:20px;font-weight:bold;color:#111111;margin:0 0 24px;">Landmark <span style="color:#f4414e;">Global</span></p>
    <div style="background:#ffffff;border-radius:12px;padding:32px;">
      <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#968f89;">Parcel update</p>
      <h1 style="margin:0 0 16px;font-size:24px;color:#111111;">${meta.label}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Hi ${escapeHtml(input.recipient)},<br/>${meta.description}</p>
      <table style="width:100%;font-size:14px;line-height:1.8;border-collapse:collapse;">
        <tr><td style="color:#968f89;padding:4px 0;">Tracking number</td><td style="font-weight:bold;">${escapeHtml(input.trackingCode)}</td></tr>
        <tr><td style="color:#968f89;padding:4px 0;">Destination</td><td>${escapeHtml(input.destination)}</td></tr>
        <tr><td style="color:#968f89;padding:4px 0;">Status</td><td><span style="background:#f4414e;color:#ffffff;border-radius:4px;padding:2px 8px;font-size:12px;font-weight:bold;">${meta.label}</span></td></tr>
      </table>
      <a href="${trackUrl}" style="display:inline-block;margin-top:24px;background:#f4414e;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 24px;border-radius:4px;">Track your parcel</a>
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:#968f89;">Landmark Global — Your logistics partner for ecommerce business.</p>
  </div>
</body></html>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: `Parcel ${input.trackingCode} — ${meta.label}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend error ${res.status}: ${body.slice(0, 300)}`);
      return { sent: false, error: `Resend API error ${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Network error";
    console.error(`[email] send failed: ${error}`);
    return { sent: false, error };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
