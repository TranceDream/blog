// Adapted from MultiTerm (MIT). Network failures intentionally degrade to a normal link.
import type { Node, Paragraph, Root, RootContent } from 'mdast';
import type {} from 'mdast-util-to-hast';
import type { Directives } from 'mdast-util-directive';
import type { Plugin } from 'unified';
import { h as createHast, type Properties } from 'hastscript';

function isDirective(node: Node): node is Directives {
  return ['containerDirective', 'leafDirective', 'textDirective'].includes(node.type);
}

function h(tag: string, properties: Properties = {}, children: unknown[] = []): Paragraph {
  const element = createHast(tag, properties);
  return {
    type: 'paragraph',
    children: children.filter(Boolean) as Paragraph['children'],
    data: { hName: element.tagName, hProperties: element.properties },
  };
}

function text(value: string) {
  return { type: 'text', value } as const;
}

function fallbackCard(label: string, url: string) {
  return h('div', { class: 'github-card github-card-fallback' }, [
    h('a', { href: url }, [text(label)]),
  ]);
}

const remarkGithubCard: Plugin<[], Root> = () => async (tree) => {
  tree.children = await Promise.all(tree.children.map(async (node): Promise<RootContent> => {
    if (!isDirective(node) || node.type !== 'leafDirective' || node.name !== 'github') return node;
    let name = node.attributes?.repo ?? node.attributes?.user;
    if (!name) return node;
    name = name.replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!/^[\w.-]+(?:\/[\w.-]+)?$/.test(name)) return fallbackCard(name, `https://github.com/${name}`);

    const url = `https://github.com/${name}`;
    const isRepo = name.includes('/');
    try {
      const response = await fetch(
        isRepo ? `https://api.github.com/repos/${name}` : `https://api.github.com/users/${name}`,
        {
          headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'tranced-log-build' },
          signal: AbortSignal.timeout(5_000),
        },
      );
      if (!response.ok) return fallbackCard(name, url);
      const data = await response.json();
      const chips = isRepo
        ? [
            data.stargazers_count !== undefined && `★ ${Intl.NumberFormat().format(data.stargazers_count)}`,
            data.forks !== undefined && `⑂ ${Intl.NumberFormat().format(data.forks)}`,
            data.language,
            data.license?.spdx_id,
          ]
        : [
            data.followers !== undefined && `${Intl.NumberFormat().format(data.followers)} followers`,
            data.public_repos !== undefined && `${Intl.NumberFormat().format(data.public_repos)} repos`,
            data.location,
          ];

      return h('div', { class: 'github-card' }, [
        h('div', { class: 'gh-title' }, [
          h('span', { class: 'gh-avatar', style: `background-image:url('${data.owner?.avatar_url ?? data.avatar_url ?? ''}')` }),
          h('a', { href: url, class: 'gh-text' }, [text(name)]),
          h('span', { class: 'gh-mark', 'aria-hidden': 'true' }, [text('GitHub')]),
        ]),
        data.description && h('p', { class: 'gh-description' }, [text(String(data.description).replace(/:[\w+-]+:/g, ''))]),
        h('div', { class: 'gh-chips' }, chips.filter(Boolean).map((chip) => h('span', {}, [text(String(chip))]))),
      ]);
    } catch {
      return fallbackCard(name, url);
    }
  }));
};

export default remarkGithubCard;
