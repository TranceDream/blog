/** Truncate readable text without splitting emoji or combining characters. */
export function excerpt(text: string, limit = 200) {
  const normalized = text.replace(/\s+/gu, ' ').trim();
  const segments = [...new Intl.Segmenter('zh-CN', { granularity: 'grapheme' }).segment(normalized)];
  return segments.slice(0, limit).map(part => part.segment).join('')
    + (segments.length > limit ? '…' : '');
}
