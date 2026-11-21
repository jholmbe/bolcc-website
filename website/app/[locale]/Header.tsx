"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import AnnouncementsModal, {
  AnnouncementsTrigger,
} from "@/components/AnnouncementsButton";
import { HEADER_BUTTON_CLASS } from "@/components/headerButton";
import { Link, usePathname } from "@/i18n/navigation";
import type { Announcement } from "@/sanity/queries";

function GlobeIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.6 3.75 5.6 3.75 9S14.5 18.4 12 21M12 3c-2.5 2.6-3.75 5.6-3.75 9S9.5 18.4 12 21" />
    </svg>
  );
}

// The current page is marked by a green underline rather than green text:
// --primary-green on the cream background is ~3.1:1, too low for body text.
function HeaderTab({
  name,
  link,
  active,
}: {
  name: string;
  link: string;
  active: boolean;
}) {
  return (
    <Link
      className={`whitespace-nowrap px-1 py-0.5 text-[17px] font-medium underline-offset-8 transition ${
        active
          ? "underline decoration-primary-green decoration-2"
          : "hover:underline hover:decoration-stone-400"
      }`}
      href={link}
      aria-current={active ? "page" : undefined}
    >
      {name}
    </Link>
  );
}

function MobileNavItem({
  name,
  link,
  active,
  onClick,
}: {
  name: string;
  link: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      className={`flex w-full items-center justify-between border-l-4 py-4 pr-6 pl-5 font-medium text-primary-text transition hover:bg-black/5 ${
        active ? "border-primary-green bg-black/5" : "border-transparent"
      }`}
      href={link}
      aria-current={active ? "page" : undefined}
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

export default function Header({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const announcementsDialogRef = useRef<HTMLDialogElement>(null);

  const openAnnouncements = () => {
    setMenuOpen(false);
    announcementsDialogRef.current?.showModal();
  };

  const navItems = [
    { name: t("about"), link: "/about" },
    { name: t("events"), link: "/events" },
    { name: t("give"), link: "/give" },
    { name: t("contact"), link: "/contact" },
    { name: t("resources"), link: "#resources" },
  ];
  const isActive = (link: string) =>
    link.startsWith("/") && (pathname === link || pathname.startsWith(`${link}/`));

  const languageSwitch = (onClick?: () => void) => (
    <Link
      className={HEADER_BUTTON_CLASS}
      href={pathname}
      locale={locale === "en" ? "zh" : "en"}
      onClick={onClick}
    >
      <GlobeIcon />
      {t("switchLanguage")}
    </Link>
  );

  // On phones (below md) the header slides away while scrolling down and returns on any
  // scroll up, so it doesn't permanently cover ~11% of a phone screen.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const THRESHOLD = 8; // px of travel before changing state, to ignore jitter
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 100) setHidden(false);
        else if (delta > THRESHOLD) setHidden(true);
        else if (delta < -THRESHOLD) setHidden(false);
        if (Math.abs(delta) > THRESHOLD) lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-stone-300 bg-primary-background motion-safe:transition-transform motion-safe:duration-200 ${
          hidden && !menuOpen ? "max-md:-translate-y-full" : ""
        }`}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="relative z-50 mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 text-primary-text font-semibold tracking-tight">
          <Link
            className="flex items-center gap-3 font-heading text-xl sm:gap-5 sm:text-2xl lg:text-[22px] xl:text-2xl"
            href="/"
          >
            <Image
              src="/logo.png"
              alt=""
              width={398}
              height={480}
              priority
              // The globes make the bottom heavy; lift it so its visual weight centers.
              // -my-2 lets it bleed into the header padding instead of making the bar taller.
              className="-my-2 h-12 w-auto -translate-y-[5%] sm:h-16"
            />
            {/* Newsreader's ascent > descent, so its ink sits ~0.09em above the
                line box's center; nudge it down to optically center on the logo. */}
            <span className="translate-y-[0.09em] text-balance">{t("churchName")}</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex gap-2">
              {navItems.map((item) => (
                <HeaderTab
                  key={item.link}
                  name={item.name}
                  link={item.link}
                  active={isActive(item.link)}
                />
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:ml-4 lg:flex">
              <AnnouncementsTrigger onClick={openAnnouncements} />
              {languageSwitch()}
            </div>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={t("toggleMenu")}
              className="lg:hidden p-2 -mr-2 rounded-md transition hover:bg-black/5"
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
        <AnnouncementsModal
          announcements={announcements}
          dialogRef={announcementsDialogRef}
        />
      </header>

        {/* Outside <header>: the header's slide transform would otherwise become
            this fixed overlay's containing block. */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-primary-background transition-opacity duration-200 ease-out ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="flex flex-col pt-20 text-primary-text">
            <div className="flex items-center gap-3 border-b border-stone-300 px-6 py-4">
              <AnnouncementsTrigger onClick={openAnnouncements} />
              {languageSwitch(() => setMenuOpen(false))}
            </div>
            {navItems.map((item, index) => (
              <div key={item.link}>
                <MobileNavItem
                  name={item.name}
                  link={item.link}
                  active={isActive(item.link)}
                  onClick={() => setMenuOpen(false)}
                />
                {index < navItems.length - 1 && (
                  <hr className="mx-6 border-t border-stone-300" />
                )}
              </div>
            ))}
          </nav>
        </div>
    </>
  );
}
