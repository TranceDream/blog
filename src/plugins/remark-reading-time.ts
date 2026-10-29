// Adapted from MultiTerm and Astro's reading-time recipe (MIT).
import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';
import getReadingTime from 'reading-time';

const remarkReadingTime: RemarkPlugin = () => (tree, { data }) => {
  if (!data.astro?.frontmatter) return;
  // Count readable text and code examples, never MDX imports or expressions.
  const parts: string[] = [];
  visit(tree, (node) => {
    if (node.type === 'text' || node.type === 'code' || node.type === 'inlineCode') {
      parts.push(node.value);
    }
  });
  const minutes = Math.max(1, Math.ceil(getReadingTime(parts.join(' ')).minutes));
  data.astro.frontmatter.minutesRead = `${minutes} min read`;
};

export default remarkReadingTime;
