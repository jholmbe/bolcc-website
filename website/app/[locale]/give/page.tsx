import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { splitParagraphs } from "@/lib/text";
import { client } from "@/sanity/client";
import { GIVE_PAGE_QUERY, type GivePageContent } from "@/sanity/queries";
import { SANITY_FETCH, urlFor } from "@/sanity/utils";

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
  const paymentQrCodeUrl = content?.paymentQrCode
    ? urlFor(content.paymentQrCode)?.width(560).height(560).url()
    : null;

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
      </div>

      {(content?.paymentTitle ||
        content?.paymentInstructions ||
        paymentQrCodeUrl) && (
        <section className="border-t border-stone-300">
          <div className="container mx-auto max-w-3xl p-8 sm:py-24">
            <div className="grid items-center gap-10 sm:grid-cols-[1fr_auto] sm:gap-16">
              <div>
                {content?.paymentTitle && (
                  <h2 className="text-2xl font-bold">{content.paymentTitle}</h2>
                )}
                {content?.paymentInstructions && (
                  <p className="mt-4 text-lg text-primary-text">
                    {content.paymentInstructions}
                  </p>
                )}
              </div>
              {paymentQrCodeUrl && (
                <Image
                  src={paymentQrCodeUrl}
                  alt={t("paymentQrCodeAlt")}
                  width={280}
                  height={280}
                  className="h-auto w-56 border border-stone-300 bg-white p-3"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
