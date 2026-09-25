import type { TrackingResult, NormalizedEvent } from "@/lib/tracking";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const ROUTES = [
  ["Brussels, Belgium", "Liège, Belgium", "Paris, France"],
  ["Antwerp, Belgium", "London Heathrow, UK", "Manchester, UK"],
  ["Machelen, Belgium", "Dorsten, Germany", "Milan, Italy"],
  ["Rotterdam, Netherlands", "Barcelona, Spain", "Madrid, Spain"],
  ["Warsaw, Poland", "Northampton, UK", "Buffalo, US"],
] as const;

const STAGES: Array<{ status: NormalizedEvent["status"]; fr: string; en: string }> = [
  { status: "CREATED", fr: "Étiquette créée — colis enregistré", en: "Shipping label created — parcel registered" },
  { status: "IN_TRANSIT", fr: "En transit vers le pays de destination", en: "In transit to destination country" },
  { status: "CUSTOMS", fr: "Dédouanement en cours", en: "Customs clearance in progress" },
  { status: "OUT_FOR_DELIVERY", fr: "En cours de livraison", en: "Out for delivery" },
  { status: "DELIVERED", fr: "Colis livré", en: "Parcel delivered" },
];

/**
 * Générateur de démo déterministe : le même code produit toujours la même
 * timeline cohérente. Permet de développer et de démontrer le parcours de
 * suivi complet sans clé API externe.
 */
export function generateDemoTracking(code: string, locale: "fr" | "en" = "en"): TrackingResult {
  const h = hashString(code.toUpperCase());
  const route = ROUTES[h % ROUTES.length];
  // Progression 1..5 : chaque code a un état d'avancement fixe
  const progress = (h % 5) + 1;
  // Base temporelle arrondie à l'heure : même code ⇒ mêmes timestamps
  // même si appelé à quelques minutes d'écart.
  const now = Math.floor(Date.now() / (1000 * 60 * 60)) * (1000 * 60 * 60);
  const stepMs = 1000 * 60 * 60 * 22; // ~22h entre les étapes

  const events: NormalizedEvent[] = [];
  for (let i = 0; i < progress; i++) {
    const stage = STAGES[i];
    const ts = new Date(now - (progress - 1 - i) * stepMs);
    events.push({
      status: stage.status,
      location: route[Math.min(i, route.length - 1)] ?? route[0],
      description: locale === "fr" ? stage.fr : stage.en,
      timestamp: ts.toISOString(),
    });
  }

  return {
    code,
    found: true,
    source: "demo",
    status: events[events.length - 1]?.status ?? "CREATED",
    destination: route[route.length - 1],
    recipient: null,
    service: null,
    events,
  };
}

/** Codes de démo documentés dans l'UI. */
export const DEMO_HINT_CODES = ["LMG-DEMO001", "LMG-DEMO002", "LMG-TEST345"];
