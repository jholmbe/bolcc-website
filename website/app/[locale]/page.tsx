import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { HOME_PAGE_QUERY, type HomePageContent } from "@/sanity/queries";
import { SANITY_FETCH } from "@/sanity/utils";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("home");

  const content = await client.fetch<HomePageContent>(
    HOME_PAGE_QUERY,
    { locale },
    SANITY_FETCH,
  );

  const serviceTimes =
    content?.serviceTimes?.filter(
      (card) => card?.title && card?.time && card?.description,
    ) ?? [];

  const footerLines = [
    content?.footerAddress,
    content?.footerPhone,
    content?.footerEmail,
  ].filter((line): line is string => Boolean(line));

  return (
    <div className="min-h-screen bg-primary-background text-primary-text">
      <main>
        <section className="pt-18 pb-24 md:pt-28 md:pb-32 border-b border-stone-300">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[2fr_3fr] md:gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
            <div className="text-center md:text-left">
              {content?.heroTitle && (
                <h1 className="text-2xl font-bold md:text-4xl">
                  {content.heroTitle}
                </h1>
              )}
              {content?.heroWelcomeMessage && (
                <p className="mt-8 text-lg">{content.heroWelcomeMessage}</p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="#times"
                  className="rounded-md text-white border border-slate-200 bg-primary-green px-5 py-3 font-medium transition hover:bg-hover-green hover:border-slate-500 hover:text-slate-700"
                >
                  {t("serviceTimes")}
                </a>
                <Link
                  href="/contact"
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium transition hover:border-slate-400 hover:bg-primary-green hover:text-white"
                >
                  {t("contactUs")}
                </Link>
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              >
                <source src="/church-hero-vid.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {(content?.missionTitle || content?.missionDescription) && (
          <section
            id="mission"
            className="bg-primary-background py-30 border-b border-stone-300"
          >
            <div className="mx-auto w-full max-w-6xl px-6 py-12">
              <h1 className="text-md font-medium uppercase tracking-[0.22em]">
                {t("mission")}
              </h1>
              <div className="mt-4 grid gap-12 sm:grid-cols-2">
                {content?.missionTitle && (
                  <h2 className="text-3xl font-bold">{content.missionTitle}</h2>
                )}
                {content?.missionDescription && (
                  <p className="text-lg text-primary-text">
                    {content.missionDescription}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {serviceTimes.length > 0 && (
          <section
            id="times"
            className="bg-primary-background mx-auto w-full max-w-6xl px-6 py-30"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              {t("serviceTimes")}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {serviceTimes.map((card) => (
                <article
                  key={`${card.title}-${card.time}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-slate-700">{card.time}</p>
                  <p className="mt-2 text-primary-text">{card.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer
        id="visit"
        className="border-t border-slate-200 bg-zinc-900 text-slate-100 pb-16"
      >
        <div id="contact" className="mx-auto w-full max-w-6xl px-6 py-12">
          {content?.footerTitle && (
            <h2 className="text-2xl font-semibold">{content.footerTitle}</h2>
          )}
          {footerLines.map((line) => (
            <p key={line} className="mt-1 text-slate-300 first:mt-3">
              {line}
            </p>
          ))}
        </div>
      </footer>
    </div>
  );
}
