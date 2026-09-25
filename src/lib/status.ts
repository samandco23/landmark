export type TrackingStatusKey =
  | "CREATED"
  | "IN_TRANSIT"
  | "CUSTOMS"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "EXCEPTION"
  | "UNKNOWN";

export const STATUS_ORDER: TrackingStatusKey[] = [
  "CREATED",
  "IN_TRANSIT",
  "CUSTOMS",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/** Couleur Tailwind associée à chaque statut (tokens du site + variantes sombres). */
export const STATUS_COLORS: Record<TrackingStatusKey, string> = {
  CREATED: "bg-grey-light-02 text-grey-dark-01 dark:bg-white/15 dark:text-white/90",
  IN_TRANSIT: "bg-blue-light/30 text-grey-dark-01 dark:bg-blue-light/30 dark:text-white/90",
  CUSTOMS: "bg-yellow/40 text-grey-dark-01 dark:bg-yellow/30 dark:text-white/90",
  OUT_FOR_DELIVERY: "bg-orange/30 text-grey-dark-01 dark:bg-orange/30 dark:text-white/90",
  DELIVERED: "bg-red text-white",
  EXCEPTION: "bg-red-dark text-white",
  UNKNOWN: "bg-grey-light-02 text-grey-mid dark:bg-white/15 dark:text-white/70",
};

/** Étapes franchies pour la timeline verticale. */
export function completedSteps(status: TrackingStatusKey): number {
  const idx = STATUS_ORDER.indexOf(status);
  if (status === "EXCEPTION" || status === "UNKNOWN") return 1;
  return idx + 1; // 0 si CREATED → 1 étape franchie
}
