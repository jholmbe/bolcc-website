import { getTranslations } from "next-intl/server";

function withCalendarParams(
  url: string,
  params: Record<string, string>,
): string {
  const separator = url.includes("?") ? "&" : "?";
  const query = new URLSearchParams(params).toString();
  return `${url}${separator}${query}`;
}

export default async function EventsPage() {
  const t = await getTranslations("events");
  const calendarEmbedUrl = process.env.NEXT_PUBLIC_CALENDAR_EMBED_URL;
  const mobileCalendarUrl = calendarEmbedUrl
    ? withCalendarParams(calendarEmbedUrl, { mode: "AGENDA" })
    : undefined;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-8">
      <h1 className="text-3xl font-bold my-10">{t("title")}</h1>
      {calendarEmbedUrl && (
        <>
          <iframe
            src={mobileCalendarUrl}
            title={t("calendarTitle")}
            className="w-full border-0 min-h-150 h-[70vh] sm:hidden rounded-3xl"
            loading="lazy"
          />
          <iframe
            src={calendarEmbedUrl}
            title={t("calendarTitle")}
            className="hidden w-full border-0 sm:block sm:h-175 rounded-3xl"
            loading="lazy"
          />
        </>
      )}
    </main>
  );
}
