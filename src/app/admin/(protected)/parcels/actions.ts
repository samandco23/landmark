"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parcelCreateSchema, trackingEventCreateSchema } from "@/lib/validations";
import { sendStatusChangeEmail } from "@/lib/email";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `LMG-${suffix}`;
}

export interface ActionState {
  ok: boolean;
  error?: string;
  code?: string;
}

export async function createParcel(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parcelCreateSchema.safeParse({
    recipient: formData.get("recipient"),
    recipientEmail: formData.get("recipientEmail") || undefined,
    destination: formData.get("destination"),
    service: formData.get("service"),
    status: formData.get("status") ?? "CREATED",
    weightKg: formData.get("weightKg") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const code = generateCode();
  try {
    await db.parcel.create({
      data: {
        trackingCode: code,
        recipient: parsed.data.recipient,
        recipientEmail: parsed.data.recipientEmail ?? null,
        destination: parsed.data.destination,
        service: parsed.data.service,
        status: parsed.data.status,
        weightKg: parsed.data.weightKg ?? null,
        events: {
          create: {
            status: parsed.data.status,
            location: null,
            description: "Parcel created in system",
          },
        },
      },
    });
  } catch {
    return { ok: false, error: "Database error" };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/parcels");
  return { ok: true, code };
}

export async function addTrackingEvent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parcelId = String(formData.get("parcelId") ?? "");
  if (!parcelId) return { ok: false, error: "Missing parcel" };

  const parsed = trackingEventCreateSchema.safeParse({
    status: formData.get("status"),
    location: formData.get("location") ?? "",
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  let statusChanged = false;
  try {
    const before = await db.parcel.findUnique({
      where: { id: parcelId },
      select: { status: true },
    });
    statusChanged = before !== null && before.status !== parsed.data.status;
    await db.trackingEvent.create({
      data: {
        parcelId,
        status: parsed.data.status,
        location: parsed.data.location || null,
        description: parsed.data.description || null,
      },
    });
    await db.parcel.update({
      where: { id: parcelId },
      data: { status: parsed.data.status },
    });
  } catch {
    return { ok: false, error: "Database error" };
  }

  revalidatePath(`/admin/parcels/${parcelId}`);
  revalidatePath("/admin");

  // Notification e-mail au destinataire (best-effort, ne bloque pas l'action).
  if (statusChanged) {
    const parcel = await db.parcel.findUnique({
      where: { id: parcelId },
      select: { trackingCode: true, recipient: true, recipientEmail: true, destination: true, status: true },
    });
    if (parcel?.recipientEmail) {
      const result = await sendStatusChangeEmail({
        to: parcel.recipientEmail,
        trackingCode: parcel.trackingCode,
        recipient: parcel.recipient,
        destination: parcel.destination,
        status: parcel.status,
      });
      if (!result.sent) console.warn(`[email] not sent for ${parcel.trackingCode}: ${result.error}`);
    }
  }

  return { ok: true };
}

export async function deleteParcel(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parcelId = String(formData.get("parcelId") ?? "");
  if (!parcelId) return { ok: false, error: "Missing parcel" };
  try {
    await db.parcel.delete({ where: { id: parcelId } });
  } catch {
    return { ok: false, error: "Database error" };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/parcels");
  return { ok: true };
}
