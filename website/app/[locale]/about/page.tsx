import { getTranslations, setRequestLocale } from "next-intl/server";

import { splitParagraphs } from "@/lib/text";
import { client } from "@/sanity/client";
import { ABOUT_PAGE_QUERY, type AboutPageContent } from "@/sanity/queries";
import { SANITY_FETCH, urlFor } from "@/sanity/utils";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const content = await client.fetch<AboutPageContent>(
    ABOUT_PAGE_QUERY,
    { locale },
    SANITY_FETCH,
  );

  const paragraphs = content?.body ? splitParagraphs(content.body) : [];
  const motherChurchImageUrl = content?.motherChurchImage
    ? urlFor(content.motherChurchImage)?.width(1600).height(1067).url()
    : null;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-3xl p-8 sm:py-24">
        <p className="text-md font-medium uppercase tracking-[0.22em]">
          {t("eyebrow")}
        </p>
        {content?.title && (
          <h1 className="mt-4 text-4xl font-bold mb-8">{content.title}</h1>
        )}
        <div className="space-y-6 text-lg text-primary-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {(content?.address || content?.mapEmbedUrl) && (
        <section className="border-t border-stone-300">
          <div className="container mx-auto max-w-3xl p-8 sm:py-24">
            <h2 className="text-2xl font-bold">{t("location")}</h2>
            {content?.address && (
              <p className="mt-4 text-lg text-primary-text whitespace-pre-line">
                {content.address}
              </p>
            )}
            {content?.mapEmbedUrl && (
              <iframe
                src={content.mapEmbedUrl}
                title={t("mapTitle")}
                className="mt-6 aspect-square w-full border-0 sm:aspect-auto sm:h-120"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            )}
          </div>
        </section>
      )}

      {(content?.motherChurchTitle || content?.motherChurchDescription) && (
        <section className="border-t border-stone-300">
          <div className="container mx-auto max-w-6xl p-8 sm:py-24">
            <div className="grid items-start gap-10 sm:grid-cols-[2fr_3fr] sm:gap-12">
              <div>
                <p className="text-md font-medium uppercase tracking-[0.22em]">
                  {t("motherChurch")}
                </p>
                {content?.motherChurchTitle && (
                  <h2 className="mt-4 text-2xl font-bold">
                    {content.motherChurchTitle}
                  </h2>
                )}
                {content?.motherChurchDescription && (
                  <p className="mt-4 text-lg text-primary-text">
                    {content.motherChurchDescription}
                  </p>
                )}
                {content?.motherChurchUrl && (
                  <a
                    href={content.motherChurchUrl}
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
                )}
              </div>
              {motherChurchImageUrl && (
                <img
                  src={motherChurchImageUrl}
                  alt={content?.motherChurchTitle ?? ""}
                  className="aspect-3/2 w-full object-cover"
                  width={1600}
                  height={1067}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
