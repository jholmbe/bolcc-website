/**
 * Languages offered in the Studio's translation UI.
 *
 * MUST stay in sync with the website's locale list at
 * `website/i18n/config.ts` (`LOCALES`). The two apps don't share code, so this
 * is a deliberate second copy — update both when adding/removing a language.
 */
export const SUPPORTED_LANGUAGES = [
  {id: 'en', title: 'English'},
  {id: 'zh', title: '中文'},
] as const

export const DEFAULT_LANGUAGE = 'en'
