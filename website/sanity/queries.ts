import type { PortableTextBlock } from "@portabletext/react";
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
  }
}`;

/* ---------------------------------------------------------------- footer ---- */
// Footer copy lives on the homePage singleton in Studio (site-wide chrome).

export type FooterContent = {
  footerTitle?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
};

export const FOOTER_QUERY = `*[_type == "homePage"][0]{
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

export type GivingMethod = {
  heading?: string;
  body?: string;
  linkUrl?: string;
  linkLabel?: string;
  image?: SanityImageSource;
  imageAlt?: string;
  /** Source dimensions, so QR codes can be rendered without being cropped. */
  imageDimensions?: { width: number; height: number };
};

export type FaqItem = {
  question?: string;
  /** Portable Text blocks, localized by `localizedString` like any other field. */
  answer?: PortableTextBlock[];
};

export type GivePageContent = {
  eyebrow?: string;
  title?: string;
  body?: string;
  onlineMethods?: GivingMethod[];
  inPersonMethods?: GivingMethod[];
  faqs?: FaqItem[];
};

const givingMethodProjection = `{
  ${localizedString("heading")},
  ${localizedString("body")},
  linkUrl,
  ${localizedString("linkLabel")},
  image,
  "imageDimensions": image.asset->metadata.dimensions{width, height},
  ${localizedString("imageAlt")}
}`;

export const GIVE_PAGE_QUERY = `*[_type == "givePage"][0]{
  ${localizedString("eyebrow")},
  ${localizedString("title")},
  ${localizedString("body")},
  onlineMethods[]${givingMethodProjection},
  inPersonMethods[]${givingMethodProjection},
  faqs[]{
    ${localizedString("question")},
    ${localizedString("answer")}
  }
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

/* --------------------------------------------------------- announcements ---- */

export type AnnouncementImage = {
  lineMessageId?: string;
  image?: SanityImageSource;
  imageDimensions?: { width: number; height: number };
};

export type Announcement = {
  _id: string;
  text?: string;
  publishedAt?: string;
  images?: AnnouncementImage[];
};

export const ANNOUNCEMENTS_QUERY = `*[_type == "announcement" && ((defined(text) && text != "") || count(images) > 0)]
  | order(publishedAt desc)[0...5]{
    _id,
    text,
    publishedAt,
    images[]{
      lineMessageId,
      image,
      "imageDimensions": image.asset->metadata.dimensions{width, height}
    }
  }`;
