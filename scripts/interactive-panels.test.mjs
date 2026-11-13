import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkInteractivePanels from '../src/plugins/remark-interactive-panels.ts';

const attr = (name, value = null) => ({ type: 'mdxJsxAttribute', name, value });
const element = (name, attributes = [], children = []) => ({ type: 'mdxJsxFlowElement', name, attributes, children });
const heading = (text) => ({ type: 'heading', depth: 2, children: [{ type: 'text', value: text }] });
const panel = (label) => element('section', [attr('slot', 'display'), attr('data-stage-panel'), attr('data-label', label)]);
const names = (node) => node.attributes.map(({ name }) => name);
const run = (tree) => {
  remarkInteractivePanels()(tree);
  return tree;
};

test('面板留在对应 H2 之后，移除 slot 并排除搜索索引', () => {
  const article = element('InteractiveArticle', [], [heading('一'), panel('输入'), heading('二'), panel('入队')]);
  run({ type: 'root', children: [article] });

  const label = (node) => node.type === 'heading'
    ? node.children[0].value
    : node.attributes.find(({ name }) => name === 'data-label').value;
  assert.deepEqual(article.children.map(label), ['一', '输入', '二', '入队']);
  for (const section of article.children.filter(child => child.name === 'section')) {
    assert.deepEqual(names(section), ['data-stage-panel', 'data-label', 'data-pagefind-ignore']);
  }
  assert.deepEqual(names(article), ['hasDisplay']);
});

test('没有展示面板时不标记 hasDisplay，也不改动普通 section', () => {
  const plain = element('section', [attr('slot', 'display')]);
  const article = element('InteractiveArticle', [attr('label', '演示')], [heading('一'), plain]);
  run({ type: 'root', children: [article] });

  assert.deepEqual(names(article), ['label']);
  assert.deepEqual(names(plain), ['slot']);
});

test('只处理 InteractiveArticle 的直接子面板', () => {
  const nested = panel('嵌套');
  const outside = panel('外部');
  const article = element('InteractiveArticle', [], [element('div', [], [nested])]);
  run({ type: 'root', children: [article, outside] });

  assert.ok(names(nested).includes('slot'));
  assert.ok(names(outside).includes('slot'));
  assert.deepEqual(names(article), []);
});
