import { NextRequest, NextResponse } from "next/server";
import { trackingCodeSchema } from "@/lib/validations";
import { trackParcel } from "@/lib/tracking";
import { generateDemoTracking } from "@/lib/demo-tracking";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const parsed = trackingCodeSchema.safeParse(code);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tracking code" }, { status: 400 });
  }

  const locale = req.nextUrl.searchParams.get("locale") === "fr" ? "fr" : "en";

  const result = await trackParcel(parsed.data);

  // Re-génère les libellés de démo dans la bonne langue si on est en mode démo.
  const finalResult =
    result.source === "demo" ? generateDemoTracking(parsed.data, locale) : result;

  return NextResponse.json(finalResult, {
    headers: { "Cache-Control": "no-store" },
  });
}
