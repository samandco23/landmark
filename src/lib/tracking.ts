import { db } from "@/lib/db";
import { fetchAftership, fetchShip24 } from "@/lib/external-api";
import { generateDemoTracking } from "@/lib/demo-tracking";

export type TrackingStatus =
  | "CREATED"
  | "IN_TRANSIT"
  | "CUSTOMS"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "EXCEPTION"
  | "UNKNOWN";

export interface NormalizedEvent {
  status: TrackingStatus;
  location: string | null;
  description: string | null;
  timestamp: string; // ISO
}

export interface TrackingResult {
  code: string;
  found: boolean;
  source: "local" | "external" | "demo";
  status: TrackingStatus;
  destination: string | null;
  recipient?: string | null;
  service?: string | null;
  events: NormalizedEvent[];
}

const LOCAL_TO_NORMALIZED: Record<string, TrackingStatus> = {
  CREATED: "CREATED",
  IN_TRANSIT: "IN_TRANSIT",
  CUSTOMS: "CUSTOMS",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  EXCEPTION: "EXCEPTION",
};

function statusFromCode(code: string): TrackingStatus {
  const c = code.toUpperCase();
  if (c === "Delivered" || c === "DELIVERED") return "DELIVERED";
  if (c === "In transit" || c === "IN_TRANSIT" || c === "TRANSIT") return "IN_TRANSIT";
  if (c === "Customs" || c === "CUSTOMS" || c === "CLEARANCE") return "CUSTOMS";
  if (c === "Out for delivery" || c === "OUT_FOR_DELIVERY") return "OUT_FOR_DELIVERY";
  if (c === "Exception" || c === "EXCEPTION") return "EXCEPTION";
  if (c === "Created" || c === "CREATED" || c === "INFO_RECEIVED") return "CREATED";
  return "UNKNOWN";
}

async function fromLocal(code: string): Promise<TrackingResult | null> {
  const parcel = await db.parcel.findUnique({
    where: { trackingCode: code },
    include: { events: { orderBy: { timestamp: "asc" } } },
  });
  if (!parcel) return null;
  return {
    code: parcel.trackingCode,
    found: true,
    source: "local",
    status: (LOCAL_TO_NORMALIZED[parcel.status] ?? "UNKNOWN") as TrackingStatus,
    destination: parcel.destination,
    recipient: parcel.recipient,
    service: parcel.service,
    events: parcel.events.map((e) => ({
      status: (LOCAL_TO_NORMALIZED[e.status] ?? "UNKNOWN") as TrackingStatus,
      location: e.location,
      description: e.description,
      timestamp: e.timestamp.toISOString(),
    })),
  };
}

/**
 * Moteur de suivi hybride :
 * 1) BDD locale (Prisma) ;
 * 2) adaptateur externe si AFTERSHIP_API_KEY ou SHIP24_API_KEY configuré ;
 * 3) générateur de démo déterministe sinon.
 */
export async function trackParcel(code: string): Promise<TrackingResult> {
  const local = await fromLocal(code);
  if (local) return local;

  if (process.env.AFTERSHIP_API_KEY) {
    try {
      const external = await fetchAftership(code);
      if (external) return external;
    } catch {
      // fallback silencieux vers le mode démo
    }
  }
  if (process.env.SHIP24_API_KEY) {
    try {
      const external = await fetchShip24(code);
      if (external) return external;
    } catch {
      // fallback silencieux vers le mode démo
    }
  }

  return generateDemoTracking(code);
}

export { statusFromCode };
