import { STATUS_COLORS, type TrackingStatusKey } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const key = (status in STATUS_COLORS ? status : "UNKNOWN") as TrackingStatusKey;
  return (
    <span className={`inline-block rounded-badge px-2 py-1 text-sm font-semibold ${STATUS_COLORS[key]}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
