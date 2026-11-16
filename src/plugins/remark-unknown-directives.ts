// Adapted from MultiTerm and Astro Starlight (MIT).
import type { Node, Parent, Root } from 'mdast';
import type { Directives, LeafDirective, TextDirective } from 'mdast-util-directive';
import { directiveToMarkdown } from 'mdast-util-directive';
import { toMarkdown } from 'mdast-util-to-markdown';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

function isDirective(node: Node): node is Directives {
  return ['containerDirective', 'leafDirective', 'textDirective'].includes(node.type);
}

function restore(node: LeafDirective | TextDirective, index: number, parent: Parent) {
  const text = { type: 'text', value: toMarkdown(node, { extensions: [directiveToMarkdown()] }) } as const;
  parent.children[index] = node.type === 'textDirective'
    ? text
    : { type: 'paragraph', children: [text] };
}

const remarkUnknownDirectives: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined || !isDirective(node)) return;
    if (node.type === 'textDirective' || node.type === 'leafDirective') restore(node, index, parent);
  });
};

export default remarkUnknownDirectives;
