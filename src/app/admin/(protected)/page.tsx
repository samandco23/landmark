import Link from "next/link";
import { db } from "@/lib/db";
import { getAdminStats } from "@/lib/stats";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BarChart, DonutChart, HBarChart } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

const cardClass = "rounded-card bg-white p-6 dark:bg-grey-dark-01";

export default async function AdminDashboardPage() {
  const [parcels, stats] = await Promise.all([
    db.parcel.findMany({
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    getAdminStats(),
  ]);

  const all = await db.parcel.findMany({ select: { status: true } });
  const counts = all.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const statuses = ["CREATED", "IN_TRANSIT", "CUSTOMS", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION"];

  return (
    <div className="u-stack u-stack--8">
      <h1 className="font-serif text-3xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statuses.map((s) => (
          <div key={s} className={cardClass}>
            <p className="font-serif text-4xl font-black">{counts[s] ?? 0}</p>
            <p className="mt-1 text-sm font-semibold text-grey-mid-01 dark:text-white/60">{s.replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>

      {/* ── Statistiques avancées ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <p className="text-sm uppercase tracking-wide text-grey-mid-02 dark:text-white/40">Total parcels</p>
          <p className="mt-2 font-serif text-4xl font-black">{stats.totalParcels}</p>
          <p className="mt-1 text-sm text-grey-mid-01 dark:text-white/50">
            {stats.deliveredCount} delivered
          </p>
        </div>
        <div className={cardClass}>
          <p className="text-sm uppercase tracking-wide text-grey-mid-02 dark:text-white/40">Avg. delivery time</p>
          <p className="mt-2 font-serif text-4xl font-black">
            {stats.avgDeliveryDays !== null ? `${stats.avgDeliveryDays}` : "—"}
            {stats.avgDeliveryDays !== null && <span className="text-2xl"> d</span>}
          </p>
          <p className="mt-1 text-sm text-grey-mid-01 dark:text-white/50">creation → delivery</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm uppercase tracking-wide text-grey-mid-02 dark:text-white/40">Destinations</p>
          <p className="mt-2 font-serif text-4xl font-black">{stats.destinations.length}</p>
          <p className="mt-1 text-sm text-grey-mid-01 dark:text-white/50">distinct countries/lanes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${cardClass} u-stack u-stack--4`}>
          <h2 className="font-serif text-2xl">Delivered parcels — last 14 days</h2>
          <BarChart data={stats.deliveredPerDay} />
        </div>
        <div className={`${cardClass} u-stack u-stack--4`}>
          <h2 className="font-serif text-2xl">Parcels by destination</h2>
          {stats.destinations.length > 0 ? (
            <DonutChart data={stats.destinations} />
          ) : (
            <p className="text-grey-mid-02 dark:text-white/40">No parcels yet.</p>
          )}
        </div>
      </div>

      {stats.avgByDestination.length > 0 && (
        <div className={`${cardClass} u-stack u-stack--4`}>
          <h2 className="font-serif text-2xl">Average delivery time by destination</h2>
          <HBarChart data={stats.avgByDestination.map((d) => ({ label: d.destination, value: d.days }))} />
        </div>
      )}

      <div className="u-stack u-stack--4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Latest parcels</h2>
          <Link href="/admin/parcels/new" className="btn btn-primary btn-sm">
            + New parcel
          </Link>
        </div>
        <div className="overflow-x-auto rounded-card bg-white dark:bg-grey-dark-01">
          <table className="w-full min-w-[640px] text-left text-body">
            <thead>
              <tr className="border-b border-grey-light-01 text-sm uppercase text-grey-mid-01 dark:border-white/10 dark:text-white/50">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p.id} className="border-b border-grey-light-01 last:border-0 dark:border-white/10">
                  <td className="px-6 py-4 font-semibold">
                    <Link href={`/admin/parcels/${p.id}`} className="text-red hover:underline">
                      {p.trackingCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 dark:text-white/80">{p.recipient}</td>
                  <td className="px-6 py-4 dark:text-white/80">{p.destination}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-mid-01 dark:text-white/50">
                    {p.updatedAt.toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {parcels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-grey-mid-02 dark:text-white/40">
                    No parcels yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
