/**
 * Graphiques SVG purs (server components, aucune dépendance).
 * Les couleurs s'adaptent au mode sombre via les classes Tailwind "dark:".
 */

export function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 700;
  const height = 180;
  const pad = 4;
  const gap = 6;
  const barW = (width - pad * 2 - gap * (data.length - 1)) / data.length;
  const plotH = height - 28;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Delivered parcels per day"
    >
      {data.map((d, i) => {
        const h = d.count === 0 ? 2 : Math.max(4, (d.count / max) * (plotH - 8));
        const x = pad + i * (barW + gap);
        const y = plotH - h;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={3}
              className="fill-red dark:fill-red"
            />
            {d.count > 0 && (
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-grey-mid-01 text-[13px] font-semibold dark:fill-white/70"
              >
                {d.count}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-grey-mid-02 text-[11px] dark:fill-white/40"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({
  data,
}: {
  data: { destination: string; count: number }[];
}) {
  const total = data.reduce((a, d) => a + d.count, 0);
  const size = 200;
  const r = 74;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Palette issue des tokens du site.
  const palette = ["#f4414e", "#e96a35", "#f5a342", "#fcde58", "#8fb4f9", "#e2337e", "#5a544f", "#968f89"];

  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-48 w-48 shrink-0" role="img" aria-label="Parcels by destination">
        <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth="26" className="stroke-grey-light-01 dark:stroke-white/10" />
        {data.map((d, i) => {
          const frac = total > 0 ? d.count / total : 0;
          const dash = frac * circumference;
          const el = (
            <circle
              key={d.destination}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              strokeWidth="26"
              stroke={palette[i % palette.length]}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          className="fill-grey-dark-01 text-[30px] font-black dark:fill-white"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          className="fill-grey-mid-02 text-[12px] dark:fill-white/50"
        >
          parcels
        </text>
      </svg>
      <ul className="w-full space-y-1.5">
        {data.map((d, i) => (
          <li key={d.destination} className="flex items-center gap-3 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: palette[i % palette.length] }}
            />
            <span className="flex-1 truncate text-grey-dark-01 dark:text-white/80">{d.destination}</span>
            <span className="font-semibold text-grey-mid-01 dark:text-white/60">
              {d.count} · {total > 0 ? Math.round((d.count / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HBarChart({
  data,
  unit = "d",
}: {
  data: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(0.1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate text-grey-dark-01 dark:text-white/80">{d.label}</span>
            <span className="shrink-0 font-semibold text-grey-mid-01 dark:text-white/60">
              {d.value}
              {unit}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-grey-light-01 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-red"
              style={{ width: `${Math.max(3, (d.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
