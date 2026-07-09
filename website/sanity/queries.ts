const localizedString = (field: string) =>
  `"${field}": coalesce(
    ${field}[language == $locale][0].value,
    ${field}[language == "en"][0].value
  )`;

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

export const POSTS_QUERY = `*[
  _type == "post"
  && language == $locale
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug && language == $locale][0]`;
