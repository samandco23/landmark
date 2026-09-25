"use client";

import { signOut } from "next-auth/react";

export function LogoutButton({
  callbackUrl = "/admin/login",
  label = "Sign out",
  className = "btn btn-outline-white btn-sm w-full !border-white/40",
}: {
  callbackUrl?: string;
  label?: string;
  className?: string;
}) {
  return (
    <button onClick={() => signOut({ callbackUrl })} className={className}>
      {label}
    </button>
  );
}
