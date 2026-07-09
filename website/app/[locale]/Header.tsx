"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

function HeaderTab({
  name,
  link,
  onClick,
}: {
  name: string;
  link: string;
  onClick?: () => void;
}) {
  return (
    <Link
      className="px-1 py-0.5 font-medium transition hover:underline underline-offset-4"
      href={link}
      onClick={onClick}
    >
      {name}
    </Link>
  );
}

function MobileNavItem({
  name,
  link,
  onClick,
}: {
  name: string;
  link: string;
  onClick?: () => void;
}) {
  return (
    <Link
      className="flex w-full items-center justify-between px-6 py-4 font-medium text-primary-text transition hover:bg-black/5"
      href={link}
      onClick={onClick}
    >
      <span>{name}</span>
      <svg
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: t("about"), link: "/about" },
    { name: t("events"), link: "/events" },
    { name: t("give"), link: "#give" },
    { name: t("contact"), link: "#contact" },
    { name: t("resources"), link: "#resources" },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="relative z-50 border-b border-stone-300 bg-primary-background">
      <div className="relative z-50 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-primary-text font-semibold tracking-tight">
        <Link className="text-xl sm:text-2xl" href="/">
          {t("churchName")}
        </Link>

        <div className="flex items-center gap-4">
          <Link
            className="hidden rounded-md bg-white border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:border-slate-400 hover:bg-primary-green hover:text-white md:inline-flex"
            href={pathname}
            locale={locale === "en" ? "zh" : "en"}
          >
            {t("switchLanguage")}
          </Link>

          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <HeaderTab key={item.link} name={item.name} link={item.link} />
            ))}
          </nav>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={t("toggleMenu")}
            className="md:hidden p-2 -mr-2 rounded-md transition hover:bg-black/5"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-40 bg-primary-background transition-opacity duration-200 ease-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col pt-20 text-primary-text">
          <div className="border-b border-stone-300 px-6 py-4">
            <Link
              className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:border-slate-400 hover:bg-primary-green hover:text-white"
              href={pathname}
              locale={locale === "en" ? "zh" : "en"}
              onClick={() => setMenuOpen(false)}
            >
              {t("switchLanguage")}
            </Link>
          </div>
          {navItems.map((item, index) => (
            <div key={item.link}>
              <MobileNavItem
                name={item.name}
                link={item.link}
                onClick={() => setMenuOpen(false)}
              />
              {index < navItems.length - 1 && (
                <hr className="mx-6 border-t border-stone-300" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
