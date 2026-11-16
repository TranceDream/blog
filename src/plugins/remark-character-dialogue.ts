// Adapted from MultiTerm (MIT): https://github.com/stelcodes/multiterm-astro
import type { Paragraph, Root } from 'mdast';
import type {} from 'mdast-util-to-hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { h as createHast, type Properties } from 'hastscript';

function h(tag: string, properties: Properties = {}, children: unknown[] = []): Paragraph {
  const element = createHast(tag, properties);
  return {
    type: 'paragraph',
    children: children as Paragraph['children'],
    data: { hName: element.tagName, hProperties: element.properties },
  };
}

const remarkCharacterDialogue: Plugin<[{ characters: Record<string, string> }], Root> =
  ({ characters }) => (tree) => {
    if (!characters || Object.keys(characters).length === 0) return;
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined || node.type !== 'containerDirective') return;
      const character = node.name;
      if (!Object.hasOwn(characters, character)) return;
      const align = node.attributes?.align;
      const alignClass = align === 'left' || align === 'right' ? ` align-${align}` : '';
      parent.children[index] = h('aside', {
        'aria-label': `Character dialogue: ${character}`,
        class: `character-dialogue${alignClass}`,
        'data-character': character,
      }, [
        h('img', {
          class: 'character-dialogue-image',
          alt: character,
          loading: 'lazy',
          src: characters[character],
          width: 100,
        }),
        h('div', { class: 'character-dialogue-content' }, node.children),
      ]);
    });
  };

export default remarkCharacterDialogue;
