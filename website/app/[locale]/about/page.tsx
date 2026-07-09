import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import { ABOUT_PAGE_QUERY } from "@/sanity/queries";

const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

type AboutPageContent = {
  title?: string;
  body?: string;
  address?: string;
  mapEmbedUrl?: string;
  motherChurchTitle?: string;
  motherChurchDescription?: string;
  motherChurchUrl?: string;
  motherChurchImage?: SanityImageSource;
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const defaults = t.raw("defaults") as {
    title: string;
    body: string;
    address: string;
    mapEmbedUrl: string;
    motherChurchTitle: string;
    motherChurchDescription: string;
    motherChurchUrl: string;
  };

  const aboutPageContent = await client.fetch<AboutPageContent>(
    ABOUT_PAGE_QUERY,
    { locale },
    options,
  );

  const title = aboutPageContent?.title ?? defaults.title;
  const body = aboutPageContent?.body ?? defaults.body;
  const address = aboutPageContent?.address ?? defaults.address;
  const mapEmbedUrl = aboutPageContent?.mapEmbedUrl ?? defaults.mapEmbedUrl;
  const motherChurchTitle =
    aboutPageContent?.motherChurchTitle ?? defaults.motherChurchTitle;
  const motherChurchDescription =
    aboutPageContent?.motherChurchDescription ??
    defaults.motherChurchDescription;
  const motherChurchUrl =
    aboutPageContent?.motherChurchUrl ?? defaults.motherChurchUrl;
  const motherChurchImageUrl = aboutPageContent?.motherChurchImage
    ? urlFor(aboutPageContent.motherChurchImage)?.width(1600).height(1067).url()
    : null;
  const paragraphs = body.split(/\n+/).filter((paragraph) => paragraph.trim());

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-3xl p-8 sm:py-24">
        <p className="text-md font-medium uppercase tracking-[0.22em]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-bold mb-8">{title}</h1>
        <div className="space-y-6 text-lg text-primary-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <section className="border-t border-stone-300">
        <div className="container mx-auto max-w-3xl p-8 sm:py-24">
          <h2 className="text-2xl font-bold">{t("location")}</h2>
          <p className="mt-4 text-lg text-primary-text whitespace-pre-line">
            {address}
          </p>
          {mapEmbedUrl && (
            <iframe
              src={mapEmbedUrl}
              title={t("mapTitle")}
              className="mt-6 aspect-square w-full border-0 sm:aspect-auto sm:h-120"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}
        </div>
      </section>

      <section className="border-t border-stone-300">
        <div className="container mx-auto max-w-6xl p-8 sm:py-24">
          <div className="grid items-start gap-10 sm:grid-cols-[2fr_3fr] sm:gap-12">
            <div>
              <p className="text-md font-medium uppercase tracking-[0.22em]">
                {t("motherChurch")}
              </p>
              <h2 className="mt-4 text-2xl font-bold">{motherChurchTitle}</h2>
              <p className="mt-4 text-lg text-primary-text">
                {motherChurchDescription}
              </p>
              <a
                href={motherChurchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 font-medium transition hover:border-slate-400 hover:bg-primary-green hover:text-white"
              >
                {t("visitMotherChurch")}
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
            {motherChurchImageUrl && (
              <img
                src={motherChurchImageUrl}
                alt={motherChurchTitle}
                className="aspect-3/2 w-full object-cover"
                width={1600}
                height={1067}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
