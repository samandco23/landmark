"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const inputClass =
    "w-full border-2 border-grey-light-01 bg-white px-4 py-3 outline-none focus:border-red dark:border-white/20 dark:bg-transparent dark:text-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-grey-dark px-4">
      <form onSubmit={submit} className="u-stack u-stack--6 w-full max-w-md bg-white p-10 rounded-card dark:bg-grey-dark-01 dark:text-white">
        <h1 className="font-serif text-2xl">Admin login</h1>
        {error && (
          <p className="border-l-4 border-red bg-grey-light-03 p-3 text-sm text-red" role="alert">
            {error}
          </p>
        )}
        <div className="u-stack u-stack--2">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
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
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
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
