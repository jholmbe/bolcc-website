import RichText from "@/components/RichText";
import type { FaqItem } from "@/sanity/queries";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-stone-300 border-y border-stone-300">
      {items.map((item, index) => (
        <details key={index} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium marker:content-none">
            <span>{item.question}</span>
            <svg
              className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          {item.answer && (
            <div className="mt-4 text-primary-text/90">
              <RichText value={item.answer} />
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
