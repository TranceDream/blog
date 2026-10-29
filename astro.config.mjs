// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { THEMES } from './src/config/themes';
import { SITE } from './src/config/site';
import rehypePixelated from './src/plugins/rehype-pixelated';
import rehypeTitleFigure from './src/plugins/rehype-title-figure';
import remarkAdmonitions from './src/plugins/remark-admonitions';
import remarkCharacterDialogue from './src/plugins/remark-character-dialogue';
import remarkGemoji from './src/plugins/remark-gemoji';
import remarkGithubCard from './src/plugins/remark-github-card';
import remarkReadingTime from './src/plugins/remark-reading-time';
import remarkUnknownDirectives from './src/plugins/remark-unknown-directives';
import labsFeature from './src/features/labs/integration';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkReadingTime,
        remarkDirective,
        remarkGithubCard,
        remarkAdmonitions,
        [remarkCharacterDialogue, { characters: SITE.characters }],
        remarkUnknownDirectives,
        remarkMath,
        remarkGemoji,
      ],
      rehypePlugins: [
        rehypeHeadingIds,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypeExternalLinks, { rel: ['noreferrer', 'noopener'], target: '_blank' }],
        rehypeUnwrapImages,
        rehypeTitleFigure,
        rehypePixelated,
        rehypeKatex,
      ],
    }),
  },
  image: { responsiveStyles: true },
  integrations: [
    sitemap({ filter: (page) => !/\/404\/?$/.test(new URL(page).pathname) }),
    labsFeature({ enabled: SITE.features.labs }),
    expressiveCode({
      themes: [...THEMES],
      useDarkModeMediaQuery: false,
      defaultProps: { showLineNumbers: false, wrap: false },
      plugins: [pluginLineNumbers()],
    }),
    mdx(),
  ],
});
