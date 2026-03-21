"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "About", link: "/about" },
  { name: "Events", link: "/events" },
  { name: "Give", link: "#give" },
  { name: "Contact", link: "#contact" },
  { name: "Resources", link: "#resources" },
];

function HeaderTab({ name, link, onClick }: { name: string; link: string; onClick?: () => void }) {
  return (
    <Link
      className="font-medium w-30 py-1.5 rounded-md text-center bg-zinc-700 transition hover:bg-zinc-500 block"
      href={link}
      onClick={onClick}
    >
      {name}
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary-green">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-slate-50 font-semibold tracking-tight">
        <Link className="text-xl sm:text-2xl" href="/">
          Bread Of Life Church
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4">
          {NAV_ITEMS.map((item) => (
            <HeaderTab key={item.name} name={item.name} link={item.link} />
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="md:hidden p-2 -mr-2 rounded-md hover:bg-white/10 transition"
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

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-6 pb-4 flex flex-col items-center gap-2 text-slate-50">
          {NAV_ITEMS.map((item) => (
            <HeaderTab
              key={item.name}
              name={item.name}
              link={item.link}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}