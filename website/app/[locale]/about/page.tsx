import Image from "next/image";
import { getTranslations } from "next-intl/server";

import ValuesAccordion from "@/components/ValuesAccordion";
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

  const t = await getTranslations("about");

  const content = await client.fetch<AboutPageContent>(
    ABOUT_PAGE_QUERY,
    { locale },
    SANITY_FETCH,
  );

  const introParagraphs = content?.intro ? splitParagraphs(content.intro) : [];
  const introImageUrl = content?.introImage
    ? urlFor(content.introImage)?.width(1200).height(900).url()
    : null;
  const values = content?.values ?? [];
  const ministries = content?.ministries ?? [];
  const historyParagraphs = content?.body ? splitParagraphs(content.body) : [];
  const motherChurchImageUrl = content?.motherChurchImage
    ? urlFor(content.motherChurchImage)?.width(1600).height(1067).url()
    : null;
  const hasMotherChurch = Boolean(
    content?.motherChurchTitle || content?.motherChurchDescription,
  );

  return (
    <main className="min-h-screen">
      {/* Who We Are */}
      <section>
        <div
          className={`mx-auto w-full px-6 py-8 sm:py-24 ${
            introImageUrl
              ? "grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16"
              : "max-w-3xl"
          }`}
        >
          <div>
            {content?.title && (
              <h1 className="mb-8 text-3xl font-bold">{content.title}</h1>
            )}
            <div className="space-y-6 text-lg text-primary-text">
              {introParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          {introImageUrl && (
            <Image
              src={introImageUrl}
              alt=""
              className="aspect-4/3 w-full rounded-md object-cover"
              width={1200}
              height={900}
              priority
            />
          )}
        </div>
      </section>

      {values.length > 0 && (
        <section className="border-t border-stone-300">
          <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-24">
            <h2 className="mb-8 text-3xl font-bold sm:mb-12">{t("values")}</h2>
            <ValuesAccordion items={values} />
          </div>
        </section>
      )}

      {ministries.length > 0 && (
        <section className="border-t border-stone-300">
          <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-24">
            <h2 className="mb-8 text-3xl font-bold sm:mb-12">
              {t("ministries")}
            </h2>
            {/*
              Each card spans three rows of the list's grid (image, name,
              description) through `subgrid`, so names line up across a row
              even when descriptions differ in length.
            */}
            <ul className="grid gap-4 sm:auto-rows-[minmax(10rem,auto)_auto_auto] sm:grid-cols-2 lg:grid-cols-4">
              {ministries.map((ministry, index) => {
                // fit("max") keeps the whole illustration (no crop). The
                // card background matches the off-white (#FBF9F5) the
                // illustrations were made on, so their edges don't show.
                const imageUrl = ministry.image
                  ? urlFor(ministry.image)?.width(640).fit("max").url()
                  : null;
                return (
                  <li
                    key={index}
                    className="row-span-3 grid grid-rows-subgrid gap-y-0 rounded-md border border-stone-300 bg-[#FBF9F5] p-6"
                  >
                    <div className="flex items-center justify-center">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt=""
                          className="h-40 w-full object-contain"
                          width={640}
                          height={640}
                        />
                      )}
                    </div>
                    <h3 className="pt-6 text-xl font-bold">{ministry.title}</h3>
                    <p className="mt-3 whitespace-pre-line text-primary-text">
                      {ministry.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {historyParagraphs.length > 0 && (
        <section className="border-t border-stone-300">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 sm:py-24 md:grid-cols-[1fr_2fr] md:gap-16">
            <h2 className="text-3xl font-bold">{t("history")}</h2>
            <div className="space-y-6 text-lg text-primary-text">
              {historyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasMotherChurch && (
        <section className="border-t border-stone-300">
          <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-24">
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
                    className="mt-6 inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-5 py-3 font-medium transition hover:border-stone-400 hover:bg-primary-green hover:text-white"
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
                <Image
                  src={motherChurchImageUrl}
                  alt={content?.motherChurchTitle ?? ""}
                  className="aspect-3/2 w-full rounded-md object-cover"
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
