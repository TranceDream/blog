import type { RemarkPlugin } from '@astrojs/markdown-remark';

interface Attribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface Node {
  type: string;
  name?: string;
  attributes?: Attribute[];
  children?: Node[];
}

const isPanel = (node: Node) => node.attributes?.some(attr => attr.name === 'data-stage-panel');

// 面板留在正文原位：禁用脚本时按普通文章阅读，启用脚本时由组件在首次绘制前移入舞台。
const remarkInteractivePanels: RemarkPlugin = () => (tree) => {
  const walk = (node: Node) => {
    if (node.name === 'InteractiveArticle') {
      const panels = (node.children ?? []).filter(isPanel);
      for (const panel of panels) {
        panel.attributes = panel.attributes!.filter(attr => attr.name !== 'slot');
        panel.attributes.push({ type: 'mdxJsxAttribute', name: 'data-pagefind-ignore', value: null });
      }
      if (panels.length) {
        node.attributes = [...(node.attributes ?? []), { type: 'mdxJsxAttribute', name: 'hasDisplay', value: null }];
      }
    }
    node.children?.forEach(walk);
  };
  walk(tree as Node);
};

export default remarkInteractivePanels;
