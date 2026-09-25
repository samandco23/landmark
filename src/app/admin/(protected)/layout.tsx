import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/parcels", label: "Parcels" },
    { href: "/admin/parcels/new", label: "New parcel" },
  ];

  return (
    <div className="min-h-screen bg-grey-light-03 dark:bg-grey-dark lg:flex">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-black text-white lg:flex">
        <div className="border-b border-grey-mid-01 p-6">
          <p className="font-serif text-lg">Landmark Admin</p>
          <p className="mt-1 truncate text-sm text-white/60">{session.user?.email}</p>
        </div>
        <nav className="u-stack u-stack--2 flex-1 p-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-card px-4 py-2.5 text-body text-white/80 hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-grey-mid-01 p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Top bar mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
          <Link href="/admin" className="font-serif text-lg">
            Landmark Admin
          </Link>
          <details className="group relative">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-card border-2 border-white/60 transition-colors hover:bg-white/10 [&::-webkit-details-marker]:hidden">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-card bg-white p-2 text-grey-dark-01 shadow-xl dark:bg-grey-dark-01 dark:text-white/90">
              <p className="truncate border-b border-grey-light-01 px-3 py-2 text-xs text-grey-mid-01">
                {session.user?.email}
              </p>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-card px-3 py-2.5 text-body hover:bg-grey-light-03 hover:text-red"
                >
                  {l.label}
                </Link>
              ))}
              <div className="p-1">
                <LogoutButton />
              </div>
            </div>
          </details>
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-12 dark:text-white/90">{children}</main>
    </div>
  );
}
