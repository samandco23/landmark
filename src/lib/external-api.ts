import type { TrackingResult, NormalizedEvent } from "@/lib/tracking";

function statusFromExternalCode(code: string): NormalizedEvent["status"] {
  const c = code.toUpperCase();
  if (c.includes("DELIVER")) return "DELIVERED";
  if (c.includes("OUT_FOR_DELIVERY") || c.includes("OUTFORDELIVERY")) return "OUT_FOR_DELIVERY";
  if (c.includes("CUSTOM") || c.includes("CLEARANCE")) return "CUSTOMS";
  if (c.includes("EXCEPTION") || c.includes("FAILED")) return "EXCEPTION";
  if (c.includes("TRANSIT") || c.includes("MOVEMENT")) return "IN_TRANSIT";
  return "CREATED";
}

/**
 * Adaptateur AfterShip : normalise la réponse vers TrackingResult.
 * Clé API : AFTERSHIP_API_KEY.
 */
export async function fetchAftership(code: string): Promise<TrackingResult | null> {
  const key = process.env.AFTERSHIP_API_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://api.aftership.com/v4/trackings?slug=landmark-global&tracking_number=${encodeURIComponent(code)}`,
    { headers: { "aftership-api-key": key, "Content-Type": "application/json" }, cache: "no-store" }
  );
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      trackings?: Array<{
        tag?: string;
        title?: string;
        destination?: string;
        checkpoints?: Array<{ tag?: string; location?: string; message?: string; checkpoint_time?: string }>;
      }>;
    };
  };

  const t = json.data?.trackings?.[0];
  if (!t) return null;

  const events: NormalizedEvent[] = (t.checkpoints ?? []).map((c) => ({
    status: statusFromExternalCode(c.tag ?? ""),
    location: c.location ?? null,
    description: c.message ?? null,
    timestamp: c.checkpoint_time ? new Date(c.checkpoint_time).toISOString() : new Date().toISOString(),
  }));
  events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    code,
    found: true,
    source: "external",
    status: statusFromExternalCode(t.tag ?? ""),
    destination: t.destination ?? null,
    recipient: null,
    service: null,
    events,
  };
}

/**
 * Adaptateur Ship24 : normalise la réponse vers TrackingResult.
 * Clé API : SHIP24_API_KEY.
 */
export async function fetchShip24(code: string): Promise<TrackingResult | null> {
  const key = process.env.SHIP24_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.ship24.com/api/v1/trackers/track", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ trackingNumber: code }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      trackings?: Array<{
        events?: Array<{ status?: string; statusMilestone?: string; location?: string; description?: string; datetime?: string }>;
        shipment?: { recipient?: { name?: string }; delivery?: { destination?: string } };
      }>;
    };
  };

  const t = json.data?.trackings?.[0];
  if (!t) return null;

  const events: NormalizedEvent[] = (t.events ?? []).map((e) => ({
    status: statusFromExternalCode(e.statusMilestone ?? e.status ?? ""),
    location: e.location ?? null,
    description: e.description ?? e.status ?? null,
    timestamp: e.datetime ? new Date(e.datetime).toISOString() : new Date().toISOString(),
  }));
  events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const last = events[events.length - 1];
  return {
    code,
    found: true,
    source: "external",
    status: last?.status ?? "UNKNOWN",
    destination: t.shipment?.delivery?.destination ?? null,
    recipient: t.shipment?.recipient?.name ?? null,
    service: null,
    events,
  };
}
