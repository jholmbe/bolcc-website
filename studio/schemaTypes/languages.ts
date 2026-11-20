/**
 * Languages offered in the Studio's translation UI.
 *
 * MUST stay in sync with the website's locale list at
 * `website/i18n/config.ts` (`LOCALES`). The two apps don't share code, so this
 * is a deliberate second copy — update both when adding/removing a language.
 */
export const SUPPORTED_LANGUAGES = [
  {id: 'zh', title: '中文'},
  {id: 'en', title: 'English'},
] as const

/** Simplified Chinese is the church's primary language and the website's fallback. */
export const DEFAULT_LANGUAGE = 'zh'
