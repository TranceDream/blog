---
title: MultiTerm 写作预览
tags: [writing, typora]
---

# 把写作留给内容

中英文混排与标点：Hello, MultiTerm。这里是 **强调文字**、*斜体*、~~删除线~~、`inline code` 和 [博客链接](https://multiterm.stelclementine.com/)。

[TOC]

## 一段日常记录

傍晚沿河走了一段路。光线慢慢退去，文字也应该保持安静。编辑这个标题，检查装饰符号是否与输入的 Markdown 标记重复。

> 简单并不意味着缺少细节。
>
> 引用中的 **重点** 与 [链接](https://typora.io/) 仍然清晰。

### 列表与任务

- 一篇普通文章
- 一篇交互展示文章
  - 正文负责解释
  - 展示负责验证

1. 写下问题
2. 给出例子

- [x] 统一配色
- [ ] 检查当前光标与选区

#### 代码示例

```typescript
// 中文注释与 token 配色
interface Post { title: string; tags: string[] }
const limit = 10;
function summarize(post: Post): string {
  return `${post.title}: ${post.tags.slice(0, limit).join(', ')}`;
}
console.log(summarize({ title: 'Hello', tags: ['astro'] }));
```

```css
#write { color: #cdd6f4; max-width: 48rem; }
```

##### 表格

| 内容 | 用途 | 状态 |
| --- | --- | --- |
| Markdown | 普通写作 | 可用 |
| 图片与引用 | 补充说明 | 可用 |
| MDX 交互组件 | 博客运行时功能 | Typora 不运行 |

###### 数学与脚注

行内公式 $E=mc^2$，块公式：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

写作可以保持轻盈。[^note]

[^note]: 检查脚注颜色与返回链接。

---

快捷键示例：<kbd>⌘</kbd> + <kbd>S</kbd>。
