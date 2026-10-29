/** Shared identity for tag labels, counts and URLs. */
export function termSlug(value: string) {
  return value.normalize('NFKC').trim().toLocaleLowerCase('zh-CN')
    .replace(/\s+/g, '-').replace(/[/?#]+/g, '-');
}

export function normalizeTags(tags: string[]) {
  return [...new Set(tags.map(termSlug).filter(Boolean))];
}
