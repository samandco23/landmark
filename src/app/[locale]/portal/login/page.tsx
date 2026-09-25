"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function PortalLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push(`/${locale}/portal`);
    router.refresh();
  }

  const inputClass =
    "w-full border-2 border-grey-light-01 bg-white px-4 py-3 outline-none focus:border-red dark:border-white/20 dark:bg-transparent dark:text-white";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-grey-light-03 px-4 dark:bg-grey-dark">
      <form
        onSubmit={submit}
        className="u-stack u-stack--6 w-full max-w-md rounded-card bg-white p-10 dark:bg-grey-dark-01 dark:text-white"
      >
        <h1 className="font-serif text-2xl">Client login</h1>
        <p className="text-sm text-grey-mid-01 dark:text-white/50">
          Access your shipments, labels and invoices.
        </p>
        {error && (
          <p className="border-l-4 border-red bg-grey-light-03 p-3 text-sm text-red dark:bg-white/10" role="alert">
            {error}
          </p>
        )}
        <div className="u-stack u-stack--2">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
            autoComplete="username"
          />
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="password" className="font-semibold">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
