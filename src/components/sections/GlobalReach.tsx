import { getTranslations } from "next-intl/server";

// Facilities extraites du GeoJSON du site source (27 installations)
const FACILITIES: Array<{ city: string; country: string; region: string; lat: number; lng: number }> = [
  { city: "Brussels", country: "Belgium", region: "Europe", lat: 50.8503, lng: 4.3517 },
  { city: "Machelen", country: "Belgium", region: "Europe", lat: 50.9, lng: 4.4333 },
  { city: "Antwerp", country: "Belgium", region: "Europe", lat: 51.2194, lng: 4.4025 },
  { city: "Willebroek", country: "Belgium", region: "Europe", lat: 51.0567, lng: 4.3597 },
  { city: "Liège", country: "Belgium", region: "Europe", lat: 50.6326, lng: 5.5797 },
  { city: "Groningen", country: "Netherlands", region: "Europe", lat: 53.2194, lng: 6.5665 },
  { city: "Roosendaal", country: "Netherlands", region: "Europe", lat: 51.5308, lng: 4.4653 },
  { city: "Dorsten", country: "Germany", region: "Europe", lat: 51.66, lng: 6.9642 },
  { city: "Kassel", country: "Germany", region: "Europe", lat: 51.3127, lng: 9.4797 },
  { city: "Halle (Saale)", country: "Germany", region: "Europe", lat: 51.4826, lng: 11.97 },
  { city: "Paris", country: "France", region: "Europe", lat: 48.8566, lng: 2.3522 },
  { city: "Lyon", country: "France", region: "Europe", lat: 45.764, lng: 4.8357 },
  { city: "Milan", country: "Italy", region: "Europe", lat: 45.4642, lng: 9.19 },
  { city: "Madrid", country: "Spain", region: "Europe", lat: 40.4168, lng: -3.7038 },
  { city: "Barcelona", country: "Spain", region: "Europe", lat: 41.3851, lng: 2.1734 },
  { city: "Warsaw", country: "Poland", region: "Europe", lat: 52.2297, lng: 21.0122 },
  { city: "London Heathrow", country: "UK", region: "Europe", lat: 51.47, lng: -0.4543 },
  { city: "Manchester", country: "UK", region: "Europe", lat: 53.4808, lng: -2.2426 },
  { city: "Northampton", country: "UK", region: "Europe", lat: 52.2405, lng: -0.9027 },
  { city: "California (state)", country: "US", region: "Americas", lat: 36.7783, lng: -119.4179 },
  { city: "Salt Lake City", country: "US", region: "Americas", lat: 40.7608, lng: -111.891 },
  { city: "Buffalo", country: "US", region: "Americas", lat: 42.8864, lng: -78.8784 },
  { city: "Atlanta", country: "US", region: "Americas", lat: 33.749, lng: -84.388 },
  { city: "Vancouver", country: "Canada", region: "Americas", lat: 49.2827, lng: -123.1207 },
  { city: "Calgary", country: "Canada", region: "Americas", lat: 51.0447, lng: -114.0719 },
  { city: "Toronto Mississauga", country: "Canada", region: "Americas", lat: 43.589, lng: -79.6441 },
  { city: "Toronto Burlington", country: "Canada", region: "Americas", lat: 43.3255, lng: -79.799 },
];

// Projection équirectangulaire simple vers un viewBox 1000x520 (long -170..180, lat 75..-45)
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 170) / 350) * 1000;
  const y = ((75 - lat) / 120) * 520;
  return { x, y };
}

const REGION_COUNTRIES: Record<string, string[]> = {
  Europe: ["Belgium", "Netherlands", "Germany", "France", "Italy", "Spain", "Poland", "UK"],
  Americas: ["United States", "Canada"],
};

export async function GlobalReach() {
  const t = await getTranslations("home.map");

  return (
    <section id="global-reach" className="bg-white" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container">
        <div className="u-stack u-stack--12 max-w-content">
          <h2 className="u-text-h3 lg:text-lg">{t("title")}</h2>
          <div className="u-prose text-md">
            <p>
              {t.rich("text", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Accordéon régions → pays (réplique la liste interactive) */}
          <ul className="u-stack u-stack--4 lg:min-h-[550px]">
            {Object.entries(REGION_COUNTRIES).map(([region, countries]) => (
              <li key={region} className="u-stack u-stack--2">
                <div className="flex h-14 items-center justify-between border-b-2 border-grey-dark px-4 font-sans text-base font-semibold sm:h-16 sm:text-lg">
                  <span>{region}</span>
                  <span className="text-grey-mid-02">{countries.length}</span>
                </div>
                <ul className="flex flex-col items-start">
                  {countries.map((c) => {
                    const count = FACILITIES.filter((f) => f.country === c || (c === "United States" && f.country === "US")).length;
                    return (
                      <li key={c} className="py-2 pl-4 text-base sm:text-lg">
                        {c} <span className="text-grey-mid-02">({count} {t("facilities")})</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {/* Carte points répliquée depuis le GeoJSON source */}
          <div className="relative min-h-[240px] sm:min-h-[300px] lg:min-h-[550px]">
            <svg viewBox="0 0 1000 520" className="h-full w-full" role="img" aria-label="Landmark Global facilities map">
              <rect width="1000" height="520" fill="hsl(30, 25%, 95.29%)" />
              {FACILITIES.map((f) => {
                const { x, y } = project(f.lat, f.lng);
                return (
                  <g key={`${f.city}-${f.country}`}>
                    <circle cx={x} cy={y} r="14" fill="hsl(356.83, 90.43%, 59.02%)" opacity="0.25">
                      <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={x} cy={y} r="6" fill="hsl(356.83, 90.43%, 41.57%)" />
                  </g>
                );
              })}
            </svg>
            <p className="mt-4 text-sm text-grey-mid">
              {FACILITIES.length} {t("facilities")} · 220+ destinations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
