// Adapted from MultiTerm (MIT): https://github.com/stelcodes/multiterm-astro
import type { Element, Root, RootContent } from 'hast';
import type { RehypePlugin } from '@astrojs/markdown-remark';
import { h } from 'hastscript';

function isElement(node: RootContent): node is Element {
  return node.type === 'element';
}

function transform(node: Root | Element) {
  node.children = node.children.map((child) => {
    if (!isElement(child)) return child;
    if (child.tagName === 'img' && child.properties?.title) {
      const title = String(child.properties.title);
      const properties = { ...child.properties };
      delete properties.title;
      return h('figure', [h('img', properties), h('figcaption', title)]);
    }
    transform(child);
    return child;
  });
}

const rehypeTitleFigure: RehypePlugin = () => (tree: Root) => transform(tree);

export default rehypeTitleFigure;
