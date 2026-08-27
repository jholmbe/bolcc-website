import Image from "next/image";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import { GIVE_PAGE_QUERY } from "@/sanity/queries";

const options = { next: { revalidate: 30 } };

type GivePageContent = {
  eyebrow?: string;
  title?: string;
  body?: string;
  paymentTitle?: string;
  paymentInstructions?: string;
  paymentQrCode?: SanityImageSource;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function GivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("give");
  const defaults = t.raw("defaults") as {
    eyebrow: string;
    title: string;
    description: string;
    paymentTitle: string;
    paymentInstructions: string;
    paymentQrCodeAlt: string;
  };
  const givePageContent = await client.fetch<GivePageContent>(
    GIVE_PAGE_QUERY,
    { locale },
    options,
  );
  const eyebrow = givePageContent?.eyebrow ?? defaults.eyebrow;
  const title = givePageContent?.title ?? defaults.title;
  const description = givePageContent?.body ?? defaults.description;
  const paymentTitle = givePageContent?.paymentTitle ?? defaults.paymentTitle;
  const paymentInstructions =
    givePageContent?.paymentInstructions ?? defaults.paymentInstructions;
  const paymentQrCodeUrl = givePageContent?.paymentQrCode
    ? urlFor(givePageContent.paymentQrCode)?.width(560).height(560).url()
    : null;
  const paymentQrCodeSource = paymentQrCodeUrl ?? "/zelle-qr-code.png";
  const paragraphs = description
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim());

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-3xl p-8 sm:py-24">
        <p className="text-md font-medium uppercase tracking-[0.22em]">
          {eyebrow}
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
          <div className="grid items-center gap-10 sm:grid-cols-[1fr_auto] sm:gap-16">
            <div>
              <h2 className="text-2xl font-bold">{paymentTitle}</h2>
              <p className="mt-4 text-lg text-primary-text">
                {paymentInstructions}
              </p>
            </div>
            <Image
              src={paymentQrCodeSource}
              alt={defaults.paymentQrCodeAlt}
              width={280}
              height={280}
              className="h-auto w-56 border border-stone-300 bg-white p-3"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
