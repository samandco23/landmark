import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client portal",
  robots: { index: false },
};

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/portal/login`);

  const parcels = await db.parcel.findMany({
    where: { ownerId: session.user?.id ?? undefined },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { events: true } } },
  });

  const inTransit = parcels.filter((p) =>
    ["IN_TRANSIT", "CUSTOMS", "OUT_FOR_DELIVERY"].includes(p.status),
  ).length;
  const delivered = parcels.filter((p) => p.status === "DELIVERED").length;

  return (
    <section className="bg-grey-light-03 dark:bg-grey-dark" style={{ paddingBlock: "var(--block-padding)" }}>
      <div className="container u-stack u-stack--8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Welcome, {session.user?.name}</h1>
            <p className="text-grey-mid-01 dark:text-white/50">{session.user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tracking" className="btn btn-outline">
              Public tracking
            </Link>
            <LogoutButton callbackUrl={`/${locale}`} label="Log out" className="btn btn-outline" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: parcels.length, label: "Total shipments" },
            { value: inTransit, label: "In transit" },
            { value: delivered, label: "Delivered" },
          ].map((s) => (
            <div key={s.label} className="rounded-card bg-white p-6 dark:bg-grey-dark-01">
              <p className="font-serif text-4xl font-black">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-grey-mid-01 dark:text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-card bg-white dark:bg-grey-dark-01">
          <table className="w-full min-w-[640px] text-left text-body">
            <thead>
              <tr className="border-b border-grey-light-01 text-sm uppercase text-grey-mid-01 dark:border-white/10 dark:text-white/50">
                <th className="px-6 py-4">Tracking</th>
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
                    <Link href={`/tracking?code=${p.trackingCode}`} className="text-red hover:underline">
                      {p.trackingCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 dark:text-white/80">{p.destination}</td>
                  <td className="px-6 py-4 text-sm dark:text-white/80">{p.service}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-white/80">{p._count?.events ?? 0}</td>
                </tr>
              ))}
              {parcels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-grey-mid-02 dark:text-white/40">
                    No shipments yet — your parcels will appear here as soon as they are booked.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
