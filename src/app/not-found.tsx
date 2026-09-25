import Link from "next/link";

export default function RootNotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-grey-warm px-4 text-center"
      style={{
        fontFamily: "var(--font-haffer), ui-sans-serif, system-ui, sans-serif",
        color: "#333333",
      }}
    >
      <div className="u-stack u-stack--6 max-w-lg">
        <p className="font-serif text-8xl font-black text-red lg:text-9xl">404</p>
        <h1 className="font-serif text-3xl">Page not found</h1>
        <p className="text-grey-mid-01">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/en"
            className="inline-block rounded-badge bg-red px-6 py-3 font-semibold text-white transition-colors hover:bg-red-dark"
          >
            Back to home
          </Link>
          <Link
            href="/en/tracking"
            className="inline-block rounded-badge border-2 border-grey-dark-01 px-6 py-3 font-semibold transition-colors hover:border-red hover:text-red"
          >
            Track a parcel
          </Link>
        </div>
      </div>
    </main>
  );
}
