"use client";

import { useState, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
    };

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClassName =
    "mt-1 w-full rounded-2xl border border-stone-300 bg-white px-3 py-2.5 text-primary-text outline-none transition focus:border-primary-green";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">{t("honeypotLabel")}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          {t("nameLabel")}{" "}
          <span className="text-primary-text/60">({t("required")})</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={inputClassName}
          placeholder={t("namePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          {t("emailFieldLabel")}{" "}
          <span className="text-primary-text/60">({t("required")})</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClassName}
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          {t("phoneFieldLabel")}{" "}
          <span className="text-primary-text/60">({t("optional")})</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={inputClassName}
          placeholder={t("phonePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          {t("messageLabel")}{" "}
          <span className="text-primary-text/60">({t("optional")})</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputClassName}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md border border-slate-200 bg-primary-green px-5 py-3 font-medium text-white transition hover:border-slate-500 hover:bg-hover-green hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {status === "success" && (
        <p className="text-sm text-primary-text" role="status">
          {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {t("error")}
        </p>
      )}
    </form>
  );
}
