import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import { HOME_PAGE_QUERY } from "@/sanity/queries";

const options = { next: { revalidate: 30 } };

type ServiceTime = {
  title: string;
  time: string;
  description: string;
};

type HomePageContent = {
  heroTitle?: string;
  heroWelcomeMessage?: string;
  missionTitle?: string;
  missionDescription?: string;
  serviceTimes?: ServiceTime[];
  footerTitle?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const defaults = t.raw("defaults") as {
    heroTitle: string;
    heroWelcomeMessage: string;
    missionTitle: string;
    missionDescription: string;
    footerTitle: string;
    footerAddress: string;
    footerPhone: string;
    footerEmail: string;
    serviceTimes: ServiceTime[];
  };

  const homePageContent = await client.fetch<HomePageContent>(
    HOME_PAGE_QUERY,
    { locale },
    options,
  );

  const heroTitle = homePageContent?.heroTitle ?? defaults.heroTitle;
  const heroWelcomeMessage =
    homePageContent?.heroWelcomeMessage ?? defaults.heroWelcomeMessage;
  const missionTitle = homePageContent?.missionTitle ?? defaults.missionTitle;
  const missionDescription =
    homePageContent?.missionDescription ?? defaults.missionDescription;

  const serviceTimes =
    homePageContent?.serviceTimes?.filter(
      (card): card is ServiceTime =>
        Boolean(card?.title && card?.time && card?.description),
    ) ?? defaults.serviceTimes;

  const footerTitle = homePageContent?.footerTitle ?? defaults.footerTitle;
  const footerAddress = homePageContent?.footerAddress ?? defaults.footerAddress;
  const footerPhone = homePageContent?.footerPhone ?? defaults.footerPhone;
  const footerEmail = homePageContent?.footerEmail ?? defaults.footerEmail;

  return (
    <div className="min-h-screen bg-primary-background text-primary-text">
      <main>
        <section className="pt-18 pb-24 md:pt-28 md:pb-32 border-b border-stone-300">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-[2fr_3fr] md:gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold md:text-4xl">{heroTitle}</h1>
              <p className="mt-8 text-lg">{heroWelcomeMessage}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="#times"
                  className="rounded-md text-white border border-slate-200 bg-primary-green px-5 py-3 font-medium transition hover:bg-hover-green hover:border-slate-500 hover:text-slate-700"
                >
                  {t("serviceTimes")}
                </a>
                <a
                  href="#contact"
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium transition hover:border-slate-400 hover:bg-primary-green hover:text-white"
                >
                  {t("contactUs")}
                </a>
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

        <section id="mission" className="bg-primary-background py-30 border-b border-stone-300">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h1 className="text-md font-medium uppercase tracking-[0.22em]">
              {t("mission")}
            </h1>
            <div className="mt-4 grid gap-12 sm:grid-cols-2">
              <h2 className="text-3xl font-bold">{missionTitle}</h2>
              <p className="text-lg text-primary-text">{missionDescription}</p>
            </div>
          </div>
        </section>

        <section id="times" className="bg-primary-background mx-auto w-full max-w-6xl px-6 py-30">
          <h2 className="text-3xl font-bold tracking-tight">{t("serviceTimes")}</h2>
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
      </main>

      <footer id="visit" className="border-t border-slate-200 bg-zinc-900 text-slate-100 pb-16">
        <div id="contact" className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold">{footerTitle}</h2>
          <p className="mt-3 text-slate-300">{footerAddress}</p>
          <p className="mt-1 text-slate-300">{footerPhone}</p>
          <p className="mt-1 text-slate-300">{footerEmail}</p>
        </div>
      </footer>
    </div>
  );
}
