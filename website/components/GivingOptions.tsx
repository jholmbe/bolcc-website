"use client";

import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type Method = "online" | "inPerson";

export default function GivingOptions({
  online,
  inPerson,
}: {
  online: ReactNode;
  inPerson: ReactNode;
}) {
  const t = useTranslations("give");
  const groupName = useId();
  const [selected, setSelected] = useState<Method>("online");

  const options: { id: Method; label: string; content: ReactNode }[] = [
    { id: "online", label: t("tabOnline"), content: online },
    { id: "inPerson", label: t("tabInPerson"), content: inPerson },
  ];

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={t("methodsLabel")}
        className="flex flex-wrap gap-3"
      >
        {options.map((option) => {
          const checked = selected === option.id;
          return (
            <label
              key={option.id}
              className={`cursor-pointer rounded-full border px-5 py-2.5 font-medium transition ${
                checked
                  ? "border-primary-green bg-primary-green text-white"
                  : "border-stone-300 bg-white text-primary-text hover:border-primary-green"
              } has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-green`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.id}
                checked={checked}
                onChange={() => setSelected(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>

      <div className="mt-8">
        {options.find((option) => option.id === selected)?.content}
      </div>
    </div>
  );
}
