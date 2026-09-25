"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { deleteParcel, type ActionState } from "@/app/admin/(protected)/parcels/actions";

const initialState: ActionState = { ok: false };

export function DeleteParcelButton({ parcelId }: { parcelId: string }) {
  const router = useRouter();
  const [state, action, pending] = useFormState(deleteParcel, initialState);

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/parcels");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this parcel and all its events?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="parcelId" value={parcelId} />
      {state.error && (
        <p className="mb-2 border-l-4 border-red bg-grey-light-03 p-3 text-sm text-red" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        className="btn btn-sm border-red-wcag text-red-wcag hover:bg-red-dark hover:border-red-dark hover:text-white"
        disabled={pending}
      >
        {pending ? "…" : "Delete parcel"}
      </button>
    </form>
  );
}
