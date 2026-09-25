import { db } from "@/lib/db";

export interface DailyCount {
  /** yyyy-mm-dd */
  date: string;
  /** ex. "23/09" */
  label: string;
  count: number;
}

export interface DestinationCount {
  destination: string;
  count: number;
}

export interface AdminStats {
  totalParcels: number;
  deliveredCount: number;
  /** Délai moyen création → livraison, en jours (null si aucune livraison). */
  avgDeliveryDays: number | null;
  /** Volumes livrés par jour sur les 14 derniers jours. */
  deliveredPerDay: DailyCount[];
  /** Top destinations par nombre de colis. */
  destinations: DestinationCount[];
  /** Délai moyen par destination (top 5 livrées), en jours. */
  avgByDestination: { destination: string; days: number }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAdminStats(): Promise<AdminStats> {
  const parcels = await db.parcel.findMany({
    include: { events: { orderBy: { timestamp: "asc" } } },
  });

  // ── Volumes livrés par jour (14 derniers jours) ────────────────────────
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const deliveredPerDay: DailyCount[] = [];
  const deliveredByKey = new Map<string, number>();
  for (const p of parcels) {
    for (const e of p.events) {
      if (e.status === "DELIVERED") {
        const key = dayKey(e.timestamp);
        deliveredByKey.set(key, (deliveredByKey.get(key) ?? 0) + 1);
      }
    }
  }
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const key = dayKey(d);
    deliveredPerDay.push({
      date: key,
      label: `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      count: deliveredByKey.get(key) ?? 0,
    });
  }

  // ── Délais de livraison (premier événement → événement DELIVERED) ──────
  const deliveryDaysByDestination = new Map<string, number[]>();
  let avgDeliveryDays: number | null = null;
  let deliveredCount = 0;
  const allDays: number[] = [];
  for (const p of parcels) {
    const delivered = p.events.find((e) => e.status === "DELIVERED");
    if (!delivered) continue;
    const first = p.events[0];
    if (!first) continue;
    const days = Math.max(
      0,
      (delivered.timestamp.getTime() - first.timestamp.getTime()) / DAY_MS,
    );
    allDays.push(days);
    deliveredCount++;
    const dest = p.destination.trim();
    const list = deliveryDaysByDestination.get(dest) ?? [];
    list.push(days);
    deliveryDaysByDestination.set(dest, list);
  }
  if (allDays.length > 0) {
    avgDeliveryDays =
      Math.round((allDays.reduce((a, b) => a + b, 0) / allDays.length) * 10) / 10;
  }

  // ── Répartition par destination ────────────────────────────────────────
  const byDestination = new Map<string, number>();
  for (const p of parcels) {
    const dest = p.destination.trim();
    byDestination.set(dest, (byDestination.get(dest) ?? 0) + 1);
  }
  const destinations: DestinationCount[] = Array.from(byDestination.entries())
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const avgByDestination = Array.from(deliveryDaysByDestination.entries())
    .map(([destination, days]) => ({
      destination,
      days: Math.round((days.reduce((a: number, b: number) => a + b, 0) / days.length) * 10) / 10,
    }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 5);

  return {
    totalParcels: parcels.length,
    deliveredCount,
    avgDeliveryDays,
    deliveredPerDay,
    destinations,
    avgByDestination,
  };
}
