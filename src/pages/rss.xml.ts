import rss from '@astrojs/rss';
import { render } from 'astro:content';
import { SITE } from '../config/site';
import { getPublishedPosts, postHref, postTitle } from '../lib/posts';

export async function GET() {
  const posts = await getPublishedPosts();
  const items = await Promise.all(posts.map(async (post) => {
    const metadata = post.data.type === 'note'
      ? (await render(post)).remarkPluginFrontmatter
      : undefined;
    return {
      title: postTitle(post),
      description: post.data.type === 'note' && typeof metadata?.excerpt === 'string'
        ? metadata.excerpt : post.data.description,
      pubDate: post.data.publishedAt,
      link: postHref(post, posts),
      categories: post.data.tags,
    };
  }));
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    customData: `<language>${SITE.locale}</language>`,
    // Summary feed includes Notes; their links point to the Archive anchor.
    items,
  });
}
