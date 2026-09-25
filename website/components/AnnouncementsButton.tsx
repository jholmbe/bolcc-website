"use client";

import { useEffect, type RefObject } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { DATE_LOCALE, type Locale } from "@/i18n/config";
import { splitParagraphs } from "@/lib/text";
import type { Announcement } from "@/sanity/queries";
import { urlFor } from "@/sanity/utils";

function formatPublishedAt(value: string | undefined, locale: string): string | null {
  if (!value) {
    return null;
  }

  const dateLocale = DATE_LOCALE[(locale as Locale) ?? "en"] ?? "en-US";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function AnnouncementCard({
  announcement,
  locale,
  imageAlt,
}: {
  announcement: Announcement;
  locale: string;
  imageAlt: string;
}) {
  const publishedAt = formatPublishedAt(announcement.publishedAt, locale);
  const paragraphs = announcement.text ? splitParagraphs(announcement.text) : [];
  const images = announcement.images?.filter((item) => item.image) ?? [];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      {publishedAt && (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-text/70">
          {publishedAt}
        </p>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-3 space-y-3 text-primary-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="font-normal whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <div
          className={`mt-4 grid gap-3 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}
        >
          {images.map((item, index) => {
            const imageUrl = item.image
              ? urlFor(item.image)?.width(1200).fit("max").url()
              : null;
            if (!imageUrl) {
              return null;
            }
            const width = item.imageDimensions?.width ?? 1200;
            const height = item.imageDimensions?.height ?? 800;

            return (
              <Image
                key={item.lineMessageId ?? `${announcement._id}-${index}`}
                src={imageUrl}
                alt={imageAlt}
                width={width}
                height={height}
                className="h-auto w-full rounded-xl border border-stone-300 bg-white object-contain"
              />
            );
          })}
        </div>
      )}
    </article>
  );
}

const triggerClassName =
  "inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:border-slate-400";

function MegaphoneIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 11 18-5v12L3 13v-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.6 16.8a3 3 0 1 1-5.8-1.6"
      />
    </svg>
  );
}

export function AnnouncementsTrigger({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  const t = useTranslations("announcements");

  return (
    <button
      type="button"
      aria-label={t("title")}
      onClick={onClick}
      className={`${triggerClassName}${className ? ` ${className}` : ""}`}
    >
      <MegaphoneIcon />
    </button>
  );
}

export default function AnnouncementsModal({
  announcements,
  dialogRef,
}: {
  announcements: Announcement[];
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const t = useTranslations("announcements");
  const locale = useLocale();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        dialog.close();
      }
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, [dialogRef]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[min(42rem,calc(100%-2rem))] max-h-[min(80vh,40rem)] rounded-2xl border border-stone-300 bg-primary-background p-0 font-normal text-primary-text shadow-xl backdrop:bg-black/40"
    >
      <div className="flex max-h-[min(80vh,40rem)] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-stone-300 px-5 py-4">
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => dialogRef.current?.close()}
            className="rounded-md p-2 transition hover:bg-black/5"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {announcements.length > 0 ? (
            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                  locale={locale}
                  imageAlt={t("imageAlt")}
                />
              ))}
            </div>
          ) : (
            <p className="text-lg text-primary-text/80">{t("empty")}</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
