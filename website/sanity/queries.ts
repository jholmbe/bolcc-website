import type { SanityImageSource } from "@sanity/image-url";

import { DEFAULT_LOCALE } from "@/i18n/config";

/**
 * Projects an `internationalizedArrayString` / `Text` field down to a single
 * string: the value for the requested `$locale`, falling back to the default
 * locale.
 */
const localizedString = (field: string) =>
  `"${field}": coalesce(
    ${field}[language == $locale][0].value,
    ${field}[language == "${DEFAULT_LOCALE}"][0].value
  )`;

/* ------------------------------------------------------------------ home ---- */

export type ServiceTime = {
  title: string;
  time: string;
  description: string;
};

export type HomePageContent = {
  heroTitle?: string;
  heroWelcomeMessage?: string;
  missionTitle?: string;
  missionDescription?: string;
  serviceTimes?: ServiceTime[];
  footerTitle?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
};

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  ${localizedString("heroTitle")},
  ${localizedString("heroWelcomeMessage")},
  ${localizedString("missionTitle")},
  ${localizedString("missionDescription")},
  serviceTimes[]{
    ${localizedString("title")},
    ${localizedString("time")},
    ${localizedString("description")}
  },
  ${localizedString("footerTitle")},
  ${localizedString("footerAddress")},
  ${localizedString("footerPhone")},
  ${localizedString("footerEmail")}
}`;

/* ----------------------------------------------------------------- about ---- */

export type AboutPageContent = {
  title?: string;
  body?: string;
  address?: string;
  mapEmbedUrl?: string;
  motherChurchTitle?: string;
  motherChurchDescription?: string;
  motherChurchUrl?: string;
  motherChurchImage?: SanityImageSource;
};

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  ${localizedString("title")},
  ${localizedString("body")},
  ${localizedString("address")},
  mapEmbedUrl,
  ${localizedString("motherChurchTitle")},
  ${localizedString("motherChurchDescription")},
  motherChurchUrl,
  motherChurchImage
}`;

/* ------------------------------------------------------------------ give ---- */

export type GivePageContent = {
  eyebrow?: string;
  title?: string;
  body?: string;
  paymentTitle?: string;
  paymentInstructions?: string;
  paymentQrCode?: SanityImageSource;
};

export const GIVE_PAGE_QUERY = `*[_type == "givePage"][0]{
  ${localizedString("eyebrow")},
  ${localizedString("title")},
  ${localizedString("body")},
  ${localizedString("paymentTitle")},
  ${localizedString("paymentInstructions")},
  paymentQrCode
}`;

/* -------------------------------------------------------------- contact ---- */

export type ContactPageContent = {
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  responseDescription?: string;
};

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  ${localizedString("title")},
  ${localizedString("email")},
  ${localizedString("phone")},
  ${localizedString("address")},
  ${localizedString("responseDescription")}
}`;
