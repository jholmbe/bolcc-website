import Image from "next/image";

import RichText from "@/components/RichText";
import type { ValueItem } from "@/sanity/queries";
import { urlFor } from "@/sanity/utils";

/**
 * Numbered accordion for the About page values. Native <details> elements, so
 * it needs no client JS; the shared `name` makes opening one close the others.
 * Any number of items works: each one only adds a row.
 */
export default function ValuesAccordion({ items }: { items: ValueItem[] }) {
  return (
    <div className="border-t border-stone-400">
      {items.map((item, index) => {
        const imageUrl = item.image
          ? urlFor(item.image)?.width(1200).height(900).url()
          : null;

        return (
          <details
            key={index}
            name="about-values"
            className="group border-b border-stone-400"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 py-5 marker:content-none sm:gap-10 sm:py-6">
              <span
                className="w-9 shrink-0 font-heading text-3xl leading-none text-stone-400 tabular-nums sm:w-14 sm:text-4xl"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="flex-1 text-lg font-bold sm:text-2xl">
                {item.title}
              </h3>
              <svg
                className="h-7 w-7 shrink-0 text-stone-400 sm:h-8 sm:w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10.5" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeWidth={1.5} d="M7.5 12h9" />
                <path
                  strokeLinecap="round"
                  strokeWidth={1.5}
                  d="M12 7.5v9"
                  className="group-open:hidden"
                />
              </svg>
            </summary>
            <div
              className={`grid gap-8 pb-10 text-lg sm:pl-24 ${
                imageUrl ? "md:grid-cols-[3fr_2fr] md:gap-12" : "max-w-3xl"
              }`}
            >
              {item.body && <RichText value={item.body} />}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt=""
                  className="aspect-4/3 w-full rounded-3xl object-cover"
                  width={1200}
                  height={900}
                />
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
