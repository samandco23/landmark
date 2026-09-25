"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { submitContact, type ContactActionState } from "./actions";

const initialState: ContactActionState = { ok: false };

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useFormState(submitContact, initialState);

  if (state.ok) {
    return (
      <div className="border-l-4 border-red bg-grey-light-03 p-6 text-body" role="status">
        {t("success")}
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.errors?.[name]?.map((e) => (
      <p key={e} className="text-sm text-red" role="alert">
        {e}
      </p>
    ));

  const inputClass =
    "w-full border-2 border-grey-light-01 bg-white px-4 py-3 outline-none focus:border-red";

  return (
    <form action={action} className="u-stack u-stack--6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="u-stack u-stack--2">
          <label htmlFor="name" className="font-semibold">
            {t("name")} *
          </label>
          <input id="name" name="name" className={inputClass} required />
          {fieldError("name")}
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="email" className="font-semibold">
            {t("email")} *
          </label>
          <input id="email" name="email" type="email" className={inputClass} required />
          {fieldError("email")}
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="company" className="font-semibold">
            {t("company")}
          </label>
          <input id="company" name="company" className={inputClass} />
        </div>
        <div className="u-stack u-stack--2">
          <label htmlFor="destination" className="font-semibold">
            {t("destination")}
          </label>
          <input id="destination" name="destination" className={inputClass} />
        </div>
      </div>
      <div className="u-stack u-stack--2">
        <label htmlFor="message" className="font-semibold">
          {t("message")} *
        </label>
        <textarea id="message" name="message" rows={6} className={inputClass} required />
        {fieldError("message")}
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "…" : t("submit")}
        </button>
      </div>
    </form>
  );
}
