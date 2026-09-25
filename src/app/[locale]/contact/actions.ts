"use server";

import { contactSchema } from "@/lib/validations";
import { promises as fs } from "fs";
import path from "path";

export interface ContactActionState {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export async function submitContact(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    destination: formData.get("destination") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, errors };
  }

  // Stockage des demandes en fichiers JSON (démo sans SMTP).
  const dir = path.join(process.cwd(), ".contact-messages");
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `msg-${Date.now()}.json`);
  await fs.writeFile(
    file,
    JSON.stringify({ ...parsed.data, receivedAt: new Date().toISOString() }, null, 2),
    "utf-8"
  );

  return { ok: true, message: "SENT" };
}
