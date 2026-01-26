"use client";

import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";

type FormStatus = "idle" | "submitting" | "success" | "error";

function getFormData(form: HTMLFormElement, locale: string) {
  const formData = new FormData(form);
  const email = (formData.get("email") ?? "").toString().trim();
  const firstName = (formData.get("first_name") ?? "").toString().trim();
  const lastName = (formData.get("last_name") ?? "").toString().trim();

  return { email, first_name: firstName, last_name: lastName, locale };
}

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.currentTarget;
      const payload = getFormData(form, locale);

      if (!payload.email) {
        setStatus("error");
        setMessage(t("emailRequired"));
        return;
      }

      setStatus("submitting");
      setMessage(null);

      try {
        const endpoint = new URL(
          "/newsletter/subscribe",
          "https://api.vanventures.blog"
        ).toString();
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Subscription failed");
        }

        setStatus("success");
        setMessage(t("successMessage"));
        form.reset();
      } catch (error) {
        console.error("Newsletter subscription failed:", error);
        setStatus("error");
        setMessage(t("errorMessage"));
      }
    },
    [t, locale]
  );

  return (
    <div className="w-full rounded-2xl bg-white/60 p-6 backdrop-blur sm:p-8">
      <div className="mb-6 space-y-3">
        <h3 className="text-xl font-medium tracking-tight text-[var(--color-charcoal)] sm:text-2xl">
          {t("title")}
        </h3>
        <p className="text-[var(--color-charcoal)]">
          {t("description")}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-slate)]">
          {t("firstName")}
          <input
            type="text"
            name="first_name"
            className="mt-2 w-full rounded-full border border-[var(--color-mist)] px-4 py-2 text-sm text-[var(--color-charcoal)] outline-none transition focus:border-[var(--color-clay)] focus:ring-2 focus:ring-[var(--color-clay)]/40"
            placeholder={t("firstNamePlaceholder")}
            autoComplete="given-name"
            disabled={status === "submitting"}
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-slate)]">
          {t("lastName")}
          <input
            type="text"
            name="last_name"
            className="mt-2 w-full rounded-full border border-[var(--color-mist)] px-4 py-2 text-sm text-[var(--color-charcoal)] outline-none transition focus:border-[var(--color-clay)] focus:ring-2 focus:ring-[var(--color-clay)]/40"
            placeholder={t("lastNamePlaceholder")}
            autoComplete="family-name"
            disabled={status === "submitting"}
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-slate)]">
          {t("email")}
          <input
            type="email"
            name="email"
            className="mt-2 w-full rounded-full border border-[var(--color-mist)] px-4 py-2 text-sm text-[var(--color-charcoal)] outline-none transition focus:border-[var(--color-clay)] focus:ring-2 focus:ring-[var(--color-clay)]/40"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            required
            disabled={status === "submitting"}
          />
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--color-charcoal)] px-6 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? t("signingUp") : t("signUp")}
        </button>

        {message ? (
          <p
            className={
              status === "success"
                ? "text-sm text-green-700"
                : "text-sm text-red-600"
            }
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
