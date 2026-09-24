import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { DATE_LOCALE, type Locale } from "@/i18n/config";
import { splitParagraphs } from "@/lib/text";
import { client } from "@/sanity/client";
import {
  ANNOUNCEMENTS_QUERY,
  type Announcement,
} from "@/sanity/queries";
import { SANITY_FETCH, urlFor } from "@/sanity/utils";

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
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      {publishedAt && (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-text/70">
          {publishedAt}
        </p>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-4 space-y-3 text-lg text-primary-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <div
          className={`mt-5 grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}
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

export default async function AnnouncementsSection({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations("announcements");
  const announcements = await client.fetch<Announcement[]>(
    ANNOUNCEMENTS_QUERY,
    {},
    SANITY_FETCH,
  );

  if (!announcements?.length) {
    return null;
  }

  return (
    <section
      id="announcements"
      className="bg-primary-background border-b border-stone-300"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-30">
        <h2 className="text-md font-medium uppercase tracking-[0.22em]">
          {t("title")}
        </h2>
        <div className="mt-8 grid gap-5">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              locale={locale}
              imageAlt={t("imageAlt")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
