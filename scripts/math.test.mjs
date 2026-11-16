import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { unified } from 'unified';
import rehypeKatex from 'rehype-katex';

const require = createRequire(import.meta.url);

test('公式渲染器、Markdown 数学扩展与 CSS 使用同一个 KaTeX', () => {
  const renderer = createRequire(require.resolve('rehype-katex'));
  const remark = createRequire(require.resolve('remark-math'));
  const math = createRequire(remark.resolve('micromark-extension-math'));
  assert.equal(renderer.resolve('katex'), require.resolve('katex'));
  assert.equal(math.resolve('katex'), require.resolve('katex'));
});

function renderMath(value, display = false) {
  const code = { type: 'element', tagName: 'code', properties: {
    className: ['language-math', display ? 'math-display' : 'math-inline'],
  }, children: [{ type: 'text', value }] };
  const tree = { type: 'root', children: [code] };
  return JSON.stringify(unified().use(rehypeKatex).runSync(tree));
}

test('数学插件能渲染分式、矩阵和行内公式', () => {
  for (const formula of ['E = mc^2', String.raw`\frac{a+b}{c}`, String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`]) {
    const result = renderMath(formula, true);
    assert.match(result, /katex-display/);
    assert.match(result, /katex-mathml/);
    assert.match(result, /katex-html/);
    assert.doesNotMatch(result, /katex-error/);
  }
  assert.doesNotMatch(renderMath('x^2'), /katex-display/);
});

test('公式不能注入未经信任的 HTML 属性', () => {
  const result = renderMath(String.raw`\htmlData{probe=injected}{x}`);
  assert.doesNotMatch(result, /data-probe/);
});
