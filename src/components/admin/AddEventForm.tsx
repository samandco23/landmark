"use client";

import { useFormState } from "react-dom";
import { addTrackingEvent, type ActionState } from "@/app/admin/(protected)/parcels/actions";

const initialState: ActionState = { ok: false };

const inputClass =
  "w-full border-2 border-grey-light-01 bg-white px-4 py-3 outline-none focus:border-red dark:border-white/20 dark:bg-transparent dark:text-white";

export function AddEventForm({ parcelId }: { parcelId: string }) {
  const [state, action, pending] = useFormState(addTrackingEvent, initialState);

  return (
    <form action={action} className="u-stack u-stack--6 rounded-card bg-white p-6 dark:bg-grey-dark-01">
      <h2 className="font-serif text-2xl">Add tracking event</h2>
      <input type="hidden" name="parcelId" value={parcelId} />
      {state.error && (
        <p className="border-l-4 border-red bg-grey-light-03 p-3 text-sm text-red" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="border-l-4 border-red bg-grey-light-03 p-3 text-sm dark:bg-white/10 dark:text-white/90" role="status">
          Event added.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="u-stack u-stack--2">
          <label htmlFor="status" className="font-semibold">Status *</label>
          <select id="status" name="status" className={inputClass} defaultValue="IN_TRANSIT">
            <option value="CREATED">CREATED</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="CUSTOMS">CUSTOMS</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="EXCEPTION">EXCEPTION</option>
          </select>
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="location" className="font-semibold">Location</label>
          <input id="location" name="location" className={inputClass} placeholder="Brussels, Belgium" />
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="description" className="font-semibold">Description</label>
          <input id="description" name="description" className={inputClass} placeholder="Departed sorting facility" />
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "…" : "Add event"}
        </button>
      </div>
    </form>
  );
}
