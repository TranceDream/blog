// Adapted from MultiTerm (MIT): https://github.com/stelcodes/multiterm-astro
import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const rehypePixelated: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (element) => {
    if (element.tagName !== 'img') return;
    const alt = element.properties?.alt;
    if (typeof alt !== 'string' || !alt.endsWith('#pixelated')) return;
    element.properties['data-pixelated'] = true;
    element.properties.alt = alt.slice(0, -'#pixelated'.length).trim();
  });
};

export default rehypePixelated;
