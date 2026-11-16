import type { RemarkPlugin } from '@astrojs/markdown-remark';

interface Node {
  type: string;
  name?: string;
  depth?: number;
  attributes?: { name?: string; value?: unknown }[];
  children?: Node[];
}

/** Advisory only: never prevent an article from rendering. */
const remarkInteractiveCheck: RemarkPlugin = () => (tree, file) => {
  const composed = file.data.astro?.frontmatter?.presentation === 'composed';
  let articles = 0;
  const warn = (message: string) => console.warn(`[interactive-article] ${file.path || 'MDX'}: ${message}`);
  const walk = (node: Node) => {
    if (node.name === 'InteractiveArticle') {
      articles++;
      const children = node.children ?? [];
      const headings = children.filter(child => child.type === 'heading' && child.depth === 2);
      const panels = children.filter(child => child.attributes?.some(attr => attr.name === 'data-stage-panel'));
      if (headings.length !== panels.length || !panels.length) {
        warn(`H2 与展示面板数量应一致且不为空，当前为 ${headings.length} / ${panels.length}。`);
      }
      if (panels.some(panel => panel.name !== 'section' || !panel.attributes?.some(attr => attr.name === 'slot' && attr.value === 'display'))) {
        warn('展示面板建议使用直接子元素 <section slot="display" data-stage-panel>。');
      }
      if (!composed) warn('使用 InteractiveArticle 时建议设置 presentation: composed。');
    }
    node.children?.forEach(walk);
  };
  walk(tree as Node);
  if (composed && articles !== 1) warn(`组合式文章建议使用一个 InteractiveArticle，当前为 ${articles} 个。`);
};

export default remarkInteractiveCheck;
