import Image from "next/image";
import { getTranslations } from "next-intl/server";

import FaqAccordion from "@/components/FaqAccordion";
import GivingOptions from "@/components/GivingOptions";
import { splitParagraphs } from "@/lib/text";
import { client } from "@/sanity/client";
import {
  GIVE_PAGE_QUERY,
  type GivePageContent,
  type GivingMethod,
} from "@/sanity/queries";
import { SANITY_FETCH, urlFor } from "@/sanity/utils";

function MethodCard({
  method,
  qrCodeAltFallback,
}: {
  method: GivingMethod;
  qrCodeAltFallback: string;
}) {
  // `fit("max")` instead of a square crop: QR codes must never be cut off, and
  // the uploaded asset may be a tall phone screenshot rather than a square.
  const imageUrl = method.image
    ? urlFor(method.image)?.width(640).fit("max").url()
    : null;
  const imageWidth = method.imageDimensions?.width ?? 560;
  const imageHeight = method.imageDimensions?.height ?? 560;

  return (
    <article className="rounded-3xl border border-stone-300 bg-white/40 p-8">
      {method.heading && (
        <h3 className="text-2xl font-bold">{method.heading}</h3>
      )}
      <div className="mt-6 grid items-center gap-8 sm:grid-cols-[1fr_auto] sm:gap-12">
        <div className="space-y-4 text-lg text-primary-text">
          {method.body &&
            splitParagraphs(method.body).map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          {method.linkUrl && (
            <a
              href={method.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md border border-slate-200 bg-primary-green px-5 py-3 font-medium text-white transition hover:border-slate-500 hover:bg-hover-green hover:text-slate-700"
            >
              {method.linkLabel ?? method.linkUrl}
            </a>
          )}
        </div>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={method.imageAlt ?? qrCodeAltFallback}
            width={imageWidth}
            height={imageHeight}
            // Never scale past the source size: an upscaled QR code goes blurry
            // and phones stop recognising it.
            style={{ maxWidth: imageWidth }}
            className="h-auto w-48 justify-self-center border border-stone-300 bg-white p-3"
          />
        )}
      </div>
    </article>
  );
}

export default async function GivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("give");

  const content = await client.fetch<GivePageContent>(
    GIVE_PAGE_QUERY,
    { locale },
    SANITY_FETCH,
  );

  const paragraphs = content?.body ? splitParagraphs(content.body) : [];
  const onlineMethods = content?.onlineMethods ?? [];
  const inPersonMethods = content?.inPersonMethods ?? [];
  const faqs = content?.faqs ?? [];
  const qrCodeAltFallback = t("qrCodeAlt");

  const methodList = (methods: GivingMethod[]) => (
    <div className="space-y-6">
      {methods.map((method, index) => (
        <MethodCard
          key={index}
          method={method}
          qrCodeAltFallback={qrCodeAltFallback}
        />
      ))}
    </div>
  );

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-3xl p-8 sm:py-24">
        {content?.eyebrow && (
          <p className="text-md font-medium uppercase tracking-[0.22em]">
            {content.eyebrow}
          </p>
        )}
        {content?.title && (
          <h1 className="mt-4 text-4xl font-bold mb-8">{content.title}</h1>
        )}
        <div className="space-y-6 text-lg text-primary-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12">
          <GivingOptions
            online={methodList(onlineMethods)}
            inPerson={methodList(inPersonMethods)}
          />
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="border-t border-stone-300">
          <div className="container mx-auto max-w-3xl p-8 sm:py-24">
            <h2 className="mb-8 text-3xl font-bold">{t("faqTitle")}</h2>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      )}
    </main>
  );
}
