import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AddEventForm } from "@/components/admin/AddEventForm";
import { DeleteParcelButton } from "@/components/admin/DeleteParcelButton";

export const dynamic = "force-dynamic";

export default async function AdminParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parcel = await db.parcel.findUnique({
    where: { id },
    include: { events: { orderBy: { timestamp: "desc" } } },
  });
  if (!parcel) notFound();

  return (
    <div className="u-stack u-stack--8 max-w-4xl">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="font-serif text-3xl">{parcel.trackingCode}</h1>
        <StatusBadge status={parcel.status} />
        <Link href="/admin/parcels" className="ml-auto text-red underline underline-offset-4">
          ← Back to list
        </Link>
      </div>

      <div className="grid gap-4 rounded-card bg-white p-6 sm:grid-cols-3 dark:bg-grey-dark-01">
        <div>
          <p className="text-sm uppercase text-grey-mid-02 dark:text-white/40">Recipient</p>
          <p className="font-semibold dark:text-white/90">{parcel.recipient}</p>
          {parcel.recipientEmail && (
            <p className="text-sm text-grey-mid-01 dark:text-white/50">{parcel.recipientEmail}</p>
          )}
        </div>
        <div>
          <p className="text-sm uppercase text-grey-mid-02 dark:text-white/40">Destination</p>
          <p className="font-semibold dark:text-white/90">{parcel.destination}</p>
        </div>
        <div>
          <p className="text-sm uppercase text-grey-mid-02 dark:text-white/40">Service</p>
          <p className="font-semibold dark:text-white/90">{parcel.service}</p>
        </div>
      </div>

      <AddEventForm parcelId={parcel.id} />

      <div className="u-stack u-stack--4 rounded-card bg-white p-6 dark:bg-grey-dark-01">
        <h2 className="font-serif text-2xl">Tracking events ({parcel.events.length})</h2>
        <ol className="u-stack u-stack--4">
          {parcel.events.map((e) => (
            <li key={e.id} className="border-l-2 border-grey-light-01 pl-4 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={e.status} />
                {e.location && <span className="font-semibold dark:text-white/90">{e.location}</span>}
                <time className="text-sm text-grey-mid-02 dark:text-white/40">
                  {e.timestamp.toLocaleString("en-GB")}
                </time>
              </div>
              {e.description && <p className="text-grey-mid-01 dark:text-white/50">{e.description}</p>}
            </li>
          ))}
        </ol>
      </div>

      <DeleteParcelButton parcelId={parcel.id} />
    </div>
  );
}
