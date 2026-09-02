/**
 * Split a multi-line CMS text field into paragraphs, dropping blank lines.
 * Used by pages that render a Sanity `text` field as a series of <p> elements.
 */
export const splitParagraphs = (value: string): string[] =>
  value.split(/\n+/).filter((paragraph) => paragraph.trim());
