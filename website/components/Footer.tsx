import { client } from "@/sanity/client";
import { FOOTER_QUERY, type FooterContent } from "@/sanity/queries";
import { SANITY_FETCH } from "@/sanity/utils";

export default async function Footer({ locale }: { locale: string }) {
  const content = await client.fetch<FooterContent>(
    FOOTER_QUERY,
    { locale },
    SANITY_FETCH,
  );

  const footerLines = [
    content?.footerAddress,
    content?.footerPhone,
    content?.footerEmail,
  ].filter((line): line is string => Boolean(line));

  if (!content?.footerTitle && footerLines.length === 0) {
    return null;
  }

  return (
    <footer
      id="visit"
      className="border-t border-slate-200 bg-footer-background text-slate-100 pb-16"
    >
      <div id="contact" className="mx-auto w-full max-w-6xl px-6 py-12">
        {content?.footerTitle && (
          <h2 className="text-2xl font-semibold">{content.footerTitle}</h2>
        )}
        {footerLines.map((line) => (
          <p key={line} className="mt-1 text-slate-300 first:mt-3">
            {line}
          </p>
        ))}
      </div>
    </footer>
  );
}
