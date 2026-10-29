// Adapted from MultiTerm (MIT): https://github.com/stelcodes/multiterm-astro
import type { Root, Text } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';
import emojiRegex from 'emoji-regex';
import { emojiToName, nameToEmoji } from 'gemoji';
import type { Plugin } from 'unified';

function emojiSpan(emoji: string, description: string): Text {
  return {
    type: 'text',
    value: emoji,
    data: {
      hName: 'span',
      hProperties: { role: 'img', ariaLabel: description.replaceAll('_', ' ') },
      hChildren: [{ type: 'text', value: emoji }],
    },
  };
}

const remarkGemoji: Plugin<[], Root> = () => (tree) => {
  findAndReplace(tree, [
    [
      /:(\+1|[-\w]+):/g,
      (_match: string, shortcode: string) =>
        Object.hasOwn(nameToEmoji, shortcode) ? emojiSpan(nameToEmoji[shortcode], shortcode) : false,
    ],
    [
      emojiRegex(),
      (emoji: string) => Object.hasOwn(emojiToName, emoji) ? emojiSpan(emoji, emojiToName[emoji]) : false,
    ],
  ]);
};

export default remarkGemoji;
