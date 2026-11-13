// Adapted from MultiTerm (MIT): https://github.com/stelcodes/multiterm-astro
import type { Paragraph, PhrasingContent, Root } from 'mdast';
import type {} from 'mdast-util-to-hast';
import { toString } from 'mdast-util-to-string';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { h as createHast, type Properties } from 'hastscript';

type AdmonitionType = 'tip' | 'note' | 'important' | 'caution' | 'warning';
const admonitionTypes = new Set<AdmonitionType>(['tip', 'note', 'important', 'caution', 'warning']);

function h(tag: string, properties: Properties = {}, children: unknown[] = []): Paragraph {
  const element = createHast(tag, properties);
  return {
    type: 'paragraph',
    children: children as Paragraph['children'],
    data: { hName: element.tagName, hProperties: element.properties },
  };
}

const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined || node.type !== 'containerDirective') return;
    if (!admonitionTypes.has(node.name as AdmonitionType)) return;

    const type = node.name as AdmonitionType;
    let title: string = type;
    let titleChildren: PhrasingContent[] = [{ type: 'text', value: type }];
    const firstChild = node.children[0];
    if (
      firstChild?.type === 'paragraph' &&
      firstChild.data &&
      'directiveLabel' in firstChild.data &&
      firstChild.children.length
    ) {
      titleChildren = firstChild.children;
      title = toString(firstChild);
      node.children.splice(0, 1);
    }

    parent.children[index] = h('aside', {
      'aria-label': title,
      class: 'admonition',
      'data-admonition-type': type,
    }, [
      h('p', { class: 'admonition-title', 'aria-hidden': 'true' }, titleChildren),
      h('div', { class: 'admonition-content' }, node.children),
    ]);
  });
};

export default remarkAdmonitions;
