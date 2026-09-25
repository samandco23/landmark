import { NextRequest, NextResponse } from "next/server";
import { trackingCodeSchema } from "@/lib/validations";
import { fetchAftership, fetchShip24 } from "@/lib/external-api";

/**
 * POST { code } — interroge explicitement les API externes (fallback
 * AfterShip puis Ship24). Utilisé quand le colis n'existe pas en local
 * et qu'une clé API est configurée.
 */
export async function POST(req: NextRequest) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = trackingCodeSchema.safeParse(body.code);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tracking code" }, { status: 400 });
  }

  const code = parsed.data;

  if (process.env.AFTERSHIP_API_KEY) {
    const result = await fetchAftership(code);
    if (result) return NextResponse.json({ ...result, provider: "aftership" });
  }
  if (process.env.SHIP24_API_KEY) {
    const result = await fetchShip24(code);
    if (result) return NextResponse.json({ ...result, provider: "ship24" });
  }

  return NextResponse.json(
    { error: "No external tracking provider configured or parcel not found" },
    { status: 404 }
  );
}
