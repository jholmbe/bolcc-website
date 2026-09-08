import {DEFAULT_LANGUAGE} from './languages'

type LocalizedItem = {language?: string; value?: string}

/**
 * Pull a display string out of an internationalizedArray* field for Studio
 * previews. Prefers the default language, then the first non-empty value.
 */
export function localizedPreviewValue(
  field: LocalizedItem[] | undefined,
  fallback = '',
): string {
  if (!Array.isArray(field) || field.length === 0) return fallback

  const preferred = field.find((item) => item.language === DEFAULT_LANGUAGE)?.value
  if (preferred) return preferred

  return field.find((item) => item.value)?.value ?? fallback
}
