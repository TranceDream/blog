# 编写 Labs

每个工具是一个独立的原生网页，放在 `src/content/labs/<id>/`。无需编写 Astro 组件或注册路由。

```text
src/content/labs/my-tool/
├── index.md       # 标题、简介和可选的补充说明
├── index.html     # 完整 HTML 文档，必须含 <head>
├── style.css      # 可选：工具自己的布局
├── client.js      # 可选：浏览器交互
└── core.test.js   # 可选：逻辑测试，不公开输出
```

`index.md` 示例：

```yaml
---
title: My Tool
description: 一句话介绍工具
publishedAt: 2026-10-28
status: finished # finished | experiment
tags: []
---
```

HTML 使用相对路径引用资源，例如 `<link rel="stylesheet" href="./style.css">` 和 `<script type="module" src="./client.js"></script>`。JavaScript 使用浏览器能直接运行的语法；不支持裸包名导入或直接运行 TypeScript。

博客自动提供：

- `/labs/my-tool/`：博客外壳与自适应高度 iframe。
- `/lab-artifacts/my-tool/index.html`：独立网页，可通过 HTTP 单独打开。
- 注入 `features/labs/shared.css`：基础排版、字体、表单控件和主题变量。
- 注入主题桥接脚本：嵌入时跟随博客主题，独立打开时使用默认深色主题。

工具 CSS 优先使用 `var(--bg)`、`var(--text)`、`var(--accent)`、`var(--surface)`、`var(--muted)` 和 `var(--line)`，避免写死主题颜色。工具的样式不会污染博客外层。

资源扩展名清单位于 `src/features/labs/asset-types.ts`；Markdown、隐藏文件和 `.test.*` 不会作为资源发布。资源链接保持相对路径。新增或删除工具后如开发服务器未刷新路由，可重启；正式构建始终重新扫描。

只放经过审核的自有工具：iframe 用于隔离样式，没有安全沙箱，工具脚本拥有同源访问能力。工具应在浏览器本地处理数据；若需要上传，应明确说明。

开关在 `SITE.features.labs`，关闭后不会生成 Labs 页面与资源。现有逻辑测试：

```sh
node --test src/content/labs/*/core.test.js
```
