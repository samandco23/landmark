import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminParcelsPage() {
  const parcels = await db.parcel.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { events: true } } },
  });

  return (
    <div className="u-stack u-stack--8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Parcels</h1>
        <Link href="/admin/parcels/new" className="btn btn-primary btn-sm">
          + New parcel
        </Link>
      </div>

      <div className="overflow-x-auto rounded-card bg-white dark:bg-grey-dark-01">
        <table className="w-full min-w-[760px] text-left text-body">
          <thead>
            <tr className="border-b border-grey-light-01 text-sm uppercase text-grey-mid-01 dark:border-white/10 dark:text-white/50">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Recipient</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Events</th>
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
                <td className="px-6 py-4 text-sm dark:text-white/80">{p.service}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-6 py-4 text-sm">{p._count?.events ?? "—"}</td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-grey-mid-02">
                  No parcels yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
