import rss from '@astrojs/rss';
import { SITE } from '../config/site';
import { getPublishedPosts, postHref, postTitle } from '../lib/posts';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    customData: `<language>${SITE.locale}</language>`,
    // Summary feed includes Notes; their links point to the Archive anchor.
    items: posts.map((post) => ({
      title: postTitle(post),
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: postHref(post, posts),
      categories: post.data.tags,
    })),
  });
}
