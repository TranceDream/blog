import type { CollectionEntry } from 'astro:content';
import { normalizeTags, termSlug } from './terms.ts';
import { SITE } from '../config/site.ts';
export { termSlug } from './terms.ts';

export type PostEntry = CollectionEntry<'posts'>;

export function archiveHref(page: number) {
  return page === 1 ? '/archive/' : `/archive/page/${page}/`;
}

export function archivePageCount(total: number) {
  return Math.max(1, Math.ceil(total / SITE.archivePageSize));
}

export function postHref(post: PostEntry, archivePosts?: PostEntry[]) {
  if (post.data.type === 'note') {
    const index = archivePosts?.findIndex((entry) => entry.id === post.id) ?? -1;
    const page = index < 0 ? 1 : Math.floor(index / SITE.archivePageSize) + 1;
    return `${archiveHref(page)}#${noteAnchor(post)}`;
  }
  return `/archive/${post.id}/`;
}

export function postTitle(post: PostEntry) {
  return post.data.title?.trim() || post.data.description.trim()
    || `Note · ${formatDate(post.data.publishedAt, true)}`;
}

export function noteAnchor(post: PostEntry) {
  return `note-${termSlug(post.id)}`;
}

export async function getVisiblePosts() {
  const { getCollection } = await import('astro:content');
  return selectVisiblePosts(await getCollection('posts'), import.meta.env.DEV);
}

export function selectVisiblePosts(posts: PostEntry[], includeDrafts = false) {
  return sortPosts(posts.filter(({ data }) => includeDrafts || !data.draft));
}

export function groupPostsByTag(posts: PostEntry[]) {
  const groups = new Map<string, PostEntry[]>();
  for (const post of posts) {
    for (const tag of normalizeTags(post.data.tags)) {
      const entries = groups.get(tag) ?? [];
      entries.push(post);
      groups.set(tag, entries);
    }
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN'));
}

export function tagHref(tag: string) {
  return `/tags/${encodeURIComponent(termSlug(tag))}/`;
}

export function seriesHref(series: string) {
  return `/series/${encodeURIComponent(termSlug(series))}/`;
}

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf() || a.id.localeCompare(b.id),
  );
}

export function formatDate(date: Date, withTime = false) {
  return new Intl.DateTimeFormat(SITE.locale, {
    timeZone: SITE.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).format(date);
}
