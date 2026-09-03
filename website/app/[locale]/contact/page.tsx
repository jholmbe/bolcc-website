import { getTranslations } from "next-intl/server";

import ContactForm from "@/components/ContactForm";
import { client } from "@/sanity/client";
import { CONTACT_PAGE_QUERY, type ContactPageContent } from "@/sanity/queries";
import { SANITY_FETCH } from "@/sanity/utils";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("contact");

  const content = await client.fetch<ContactPageContent>(
    CONTACT_PAGE_QUERY,
    { locale },
    SANITY_FETCH,
  );

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-6xl p-8 sm:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <section className="space-y-6 text-lg text-primary-text">
            {content?.title && (
              <h2 className="text-3xl font-bold">{content.title}</h2>
            )}
            {content?.responseDescription && (
              <p className="md:mb-20 leading-relaxed">{content.responseDescription}</p>
            )}
            {(content?.email || content?.phone || content?.address) && (
              <div className="space-y-6">
                {content?.email && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-text/70">
                      {t("emailLabel")}
                    </p>
                    <a
                      href={`mailto:${content.email}`}
                      className="mt-1 block transition hover:underline"
                    >
                      {content.email}
                    </a>
                  </div>
                )}
                {content?.phone && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-text/70">
                      {t("phoneLabel")}
                    </p>
                    <a
                      href={`tel:${content.phone.replace(/\s+/g, "")}`}
                      className="mt-1 block transition hover:underline"
                    >
                      {content.phone}
                    </a>
                  </div>
                )}
                {content?.address && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-text/70">
                      {t("addressLabel")}
                    </p>
                    <p className="mt-1 whitespace-pre-line">{content.address}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="border rounded-3xl border-stone-300 p-8 sm:p-12">
            <ContactForm />
          </section>
        </div>
      </div>
    </main>
  );
}
