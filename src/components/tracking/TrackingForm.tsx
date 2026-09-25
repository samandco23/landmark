"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { TrackingResult } from "@/lib/tracking";
import { STATUS_ORDER, type TrackingStatusKey } from "@/lib/status";
import { DEMO_HINT_CODES } from "@/lib/demo-tracking";

export function TrackingForm() {
  const t = useTranslations("tracking");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pré-remplissage depuis ?code=… (lien « Track your parcel » des e-mails).
  const initialCode = searchParams.get("code")?.trim() ?? "";
  const trackedInitial = useRef("");
  useEffect(() => {
    if (initialCode && trackedInitial.current !== initialCode) {
      trackedInitial.current = initialCode;
      setCode(initialCode.toUpperCase());
      void lookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  async function lookup(value: string) {
    const normalized = value.trim().toUpperCase();
    if (!normalized) {
      setError(t("notFound"));
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(normalized)}?locale=${locale}`);
      if (!res.ok) {
        setError(t("notFound"));
        return;
      }
      const data = (await res.json()) as TrackingResult;
      if (!data.found) {
        setError(t("notFound"));
        return;
      }
      setResult(data);
    } catch {
      setError(t("notFound"));
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await lookup(code.trim());
  }

  const currentIndex = result ? STATUS_ORDER.indexOf(result.status as TrackingStatusKey) : -1;

  return (
    <div className="u-stack u-stack--8">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t("placeholder")}
          className="w-full border-2 border-grey-light-01 bg-white px-4 py-3 text-lg outline-none focus:border-red"
          aria-label={t("title")}
          required
        />
        <button type="submit" className="btn btn-primary shrink-0" disabled={loading}>
          {loading ? "…" : t("button")}
        </button>
      </form>

      <p className="text-sm text-grey-mid">
        {t("demoHint")}{" "}
        {DEMO_HINT_CODES.map((c, i) => (
          <span key={c}>
            <button
              type="button"
              onClick={() => setCode(c)}
              className="font-semibold text-red underline underline-offset-2"
            >
              {c}
            </button>
            {i < DEMO_HINT_CODES.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      {error && (
        <div className="border-l-4 border-red bg-grey-light-03 p-4 text-body" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="u-stack u-stack--6 border border-grey-light-01 bg-white p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-badge bg-red px-2 py-1 text-sm font-semibold text-white">
              {t(`status.${result.status}`)}
            </span>
            {result.destination && (
              <span className="text-grey-mid-01">
                {t("destination")} : <strong>{result.destination}</strong>
              </span>
            )}
            <span className="ml-auto rounded-badge bg-grey-light-02 px-2 py-1 text-xs text-grey-mid-01">
              {result.source}
            </span>
          </div>

          <h3 className="font-sans text-lg font-semibold">{t("timeline")}</h3>
          <ol className="flex flex-col">
            {STATUS_ORDER.map((status, i) => {
              const done = i <= currentIndex;
              const isLast = i === STATUS_ORDER.length - 1;
              const event = [...result.events].reverse().find((e) => e.status === status);
              return (
                <li key={status} className="flex gap-4" style={{ minHeight: isLast ? undefined : "64px" }}>
                  <div className="flex flex-col items-center">
                    <div className="timeline-dot" data-done={done}>
                      {done && (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                          <path d="M5 12.5L10 17.5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {!isLast && <div className="timeline-line my-1" data-done={i < currentIndex} />}
                  </div>
                  <div className="pb-6">
                    <p className={`font-semibold ${done ? "text-grey-dark-01" : "text-grey-mid-02"}`}>
                      {t(`status.${status}`)}
                    </p>
                    {event && (
                      <p className="text-sm text-grey-mid-01">
                        {event.location && <span>{event.location} — </span>}
                        {event.description}
                      </p>
                    )}
                    {event && (
                      <time className="text-xs text-grey-mid-02">
                        {new Date(event.timestamp).toLocaleString(locale)}
                      </time>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {result.events.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-red">
                {result.events.length} events
              </summary>
              <ul className="mt-2 space-y-1 text-grey-mid-01">
                {[...result.events].reverse().map((e, i) => (
                  <li key={i}>
                    <time>{new Date(e.timestamp).toLocaleString(locale)}</time> — {e.location ?? ""} {e.description ?? ""}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
