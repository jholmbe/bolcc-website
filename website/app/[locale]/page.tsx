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
                  className="rounded-md border border-primary-green bg-primary-green px-5 py-3 font-medium text-white transition hover:border-hover-green hover:bg-hover-green hover:text-primary-text"
                >
                  {t("serviceTimes")}
                </a>
                <Link
                  href="/contact"
                  className="rounded-md border border-stone-300 bg-white px-5 py-3 font-medium transition hover:border-stone-400 hover:bg-primary-green hover:text-white"
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
