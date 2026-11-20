import type {Rule, SchemaTypeDefinition} from 'sanity'

import {DEFAULT_LANGUAGE} from './languages'

/**
 * Adds a Studio warning to every `internationalizedArray*` field that has text
 * in some language but none in Chinese. The website falls back to Chinese when
 * a translation is missing, so an empty Chinese entry means the text may not
 * show up at all.
 *
 * This is a warning, not an error: editors can still publish.
 */

const MISSING_CHINESE_MESSAGE = '缺少中文内容 — Chinese text is missing for this field.'

type LocalizedItem = {_key?: string; language?: string; value?: unknown}

function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value != null
}

function missingChinese(field: unknown): boolean {
  if (!Array.isArray(field)) return false
  const items = field as LocalizedItem[]
  const filled = items.filter((item) => hasContent(item?.value))
  if (filled.length === 0) return false // Empty field: `required()` handles that case.
  return !filled.some((item) => (item.language ?? item._key) === DEFAULT_LANGUAGE)
}

type ValidationFn = (rule: Rule) => Rule | Rule[] | undefined
type FieldLike = {
  type?: string
  validation?: ValidationFn
  fields?: FieldLike[]
  of?: FieldLike[]
  [key: string]: unknown
}

function addReminder(field: FieldLike): FieldLike {
  const next: FieldLike = {...field}

  if (Array.isArray(field.fields)) next.fields = field.fields.map(addReminder)
  if (Array.isArray(field.of)) next.of = field.of.map(addReminder)

  if (typeof field.type === 'string' && field.type.startsWith('internationalizedArray')) {
    const original = field.validation
    next.validation = (rule: Rule) => {
      const base = original ? original(rule) : undefined
      const existing = base === undefined ? [] : Array.isArray(base) ? base : [base]
      const reminder = rule
        .custom((value) => (missingChinese(value) ? MISSING_CHINESE_MESSAGE : true))
        .warning()
      return [...existing, reminder]
    }
  }

  return next
}

/** Applies the missing-Chinese warning to every localized field in a schema type. */
export function withChineseReminders(type: SchemaTypeDefinition): SchemaTypeDefinition {
  return addReminder(type as unknown as FieldLike) as unknown as SchemaTypeDefinition
}
