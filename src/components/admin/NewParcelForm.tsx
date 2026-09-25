"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { createParcel, type ActionState } from "@/app/admin/(protected)/parcels/actions";

const initialState: ActionState = { ok: false };

const inputClass =
  "w-full border-2 border-grey-light-01 bg-white px-4 py-3 outline-none focus:border-red dark:border-white/20 dark:bg-transparent dark:text-white";

export function NewParcelForm() {
  const [state, action, pending] = useFormState(createParcel, initialState);

  if (state.ok && state.code) {
    return (
      <div className="u-stack u-stack--6 rounded-card bg-white p-8 dark:bg-grey-dark-01">
        <p className="border-l-4 border-red bg-grey-light-03 p-4 text-body dark:bg-white/10 dark:text-white/90" role="status">
          Parcel created with tracking code <strong>{state.code}</strong>
        </p>
        <div className="flex gap-4">
          <Link href="/admin/parcels/new" className="btn btn-outline">
            Create another
          </Link>
          <Link href="/admin/parcels" className="btn btn-primary">
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="u-stack u-stack--6 rounded-card bg-white p-8 dark:bg-grey-dark-01">
      {state.error && (
        <p className="border-l-4 border-red bg-grey-light-03 p-3 text-sm text-red dark:bg-white/10" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="u-stack u-stack--2">
          <label htmlFor="recipient" className="font-semibold">Recipient *</label>
          <input id="recipient" name="recipient" className={inputClass} required />
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="recipientEmail" className="font-semibold">Recipient email</label>
          <input
            id="recipientEmail"
            name="recipientEmail"
            type="email"
            className={inputClass}
            placeholder="customer@example.com"
          />
          <p className="text-sm text-grey-mid-01">
            Optional — the customer gets an automatic email on every status change.
          </p>
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="destination" className="font-semibold">Destination *</label>
          <input id="destination" name="destination" className={inputClass} required />
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="service" className="font-semibold">Service</label>
          <select id="service" name="service" className={inputClass} defaultValue="PARCEL">
            <option value="PARCEL">PARCEL</option>
            <option value="ECOMMERCE">ECOMMERCE</option>
            <option value="MAIL">MAIL</option>
            <option value="TRADE">TRADE</option>
            <option value="RETURNS">RETURNS</option>
            <option value="FULFILLMENT">FULFILLMENT</option>
          </select>
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="status" className="font-semibold">Initial status</label>
          <select id="status" name="status" className={inputClass} defaultValue="CREATED">
            <option value="CREATED">CREATED</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="CUSTOMS">CUSTOMS</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
          </select>
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="weightKg" className="font-semibold">Weight (kg)</label>
          <input id="weightKg" name="weightKg" type="number" step="0.1" min="0" className={inputClass} />
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "…" : "Create parcel"}
        </button>
      </div>
    </form>
  );
}
