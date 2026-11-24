import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import {
  HOME_PAGE_QUERY,
  type HomePageContent,
  type ServiceTime,
} from "@/sanity/queries";
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

  const keep = (card: ServiceTime) => Boolean(card?.title && card?.time);
  const serviceGroups = [
    { heading: t("sunday"), cards: content?.sundayTimes?.filter(keep) ?? [] },
    { heading: t("weekly"), cards: content?.weeklyTimes?.filter(keep) ?? [] },
  ].filter((group) => group.cards.length > 0);

  return (
    <div className="min-h-screen bg-primary-background text-primary-text">
      <main>
        {/*
          Hero: the video fills the width (a gutter, 12px corners) and the
          copy sits on top of it, aligned to the max-w-6xl content column.
        */}
        <section className="px-2 pt-2 pb-2 sm:px-8 sm:pt-4 sm:pb-8">
          <div className="relative isolate flex min-h-[32rem] items-center overflow-hidden rounded-xl bg-stone-900 h-[calc(100svh-8.5rem)] max-h-[56rem]">
            <video
              className="absolute inset-0 -z-20 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            >
              <source src="/church-hero-vid.mp4" type="video/mp4" />
            </video>
            {/* Darkens the video so white text stays readable (left side only from md up). */}
            <div
              className="absolute inset-0 -z-10 bg-black/35 md:bg-transparent md:bg-linear-to-r md:from-black/55 md:via-black/25 md:to-transparent"
              aria-hidden
            />
            {/*
              Cancels the section's gutter so this box spans the viewport like
              the rest of the page. Its padding then puts the text where the
              max-w-6xl column's text starts (50% - 36rem + 1.5rem), but never
              closer than 1.5rem to the video's edge on narrower screens.
            */}
            <div className="-mx-2 w-[calc(100%+1rem)] sm:-mx-8 sm:w-[calc(100%+4rem)]">
              <div className="px-[max(1.5rem,calc(50%-34.5rem))] py-16 text-white sm:px-[max(3.5rem,calc(50%-34.5rem))]">
                <div className="max-w-2xl">
                  {content?.heroTitle && (
                    <h1 className="text-4xl font-bold leading-tight [text-shadow:0_1px_16px_rgb(0_0_0/0.5)] md:text-5xl">
                      {content.heroTitle}
                    </h1>
                  )}
                  {content?.heroWelcomeMessage && (
                    <p className="mt-6 text-lg text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.5)]">
                      {content.heroWelcomeMessage}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#times"
                      className="rounded-md border border-white bg-white px-5 py-3 font-medium text-primary-text transition hover:border-primary-green hover:bg-primary-green hover:text-white"
                    >
                      {t("serviceTimes")}
                    </a>
                    <Link
                      href="/contact"
                      className="rounded-md border border-white/60 px-5 py-3 font-medium text-white transition hover:border-white hover:bg-white/10"
                    >
                      {t("contactUs")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {serviceGroups.length > 0 && (
          <section
            id="times"
            className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-30 md:grid-cols-2 md:gap-12 lg:gap-16"
          >
            {serviceGroups.map((group) => (
              <div key={group.heading}>
                <h2 className="mb-8 text-3xl font-bold sm:mb-12">
                  {group.heading}
                </h2>
                <ul className="space-y-4 border-l-2 border-primary-green pl-6 sm:pl-8">
                  {group.cards.map((card) => (
                    <li
                      key={`${card.title}-${card.time}`}
                      className="rounded-md border border-stone-300 bg-[#FBF9F5] px-6 py-7 sm:min-h-36 sm:px-10"
                    >
                      <h3 className="text-xl font-bold">{card.title}</h3>
                      <p className="mt-2 text-primary-text/70">{card.time}</p>
                      {card.description && (
                        <p className="mt-2 whitespace-pre-line">
                          {card.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
