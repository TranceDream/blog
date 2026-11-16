# AGENTS.md

请用简体中文沟通、写注释和文档。你只负责代码开发，不修改文章内容。

## 项目背景

- 这是部署在 Cloudflare Pages 上的个人博客 https://trancedre.am，用 Astro 生成纯静态站点。
- `next` 是开发分支，`main` 是生产分支。`main` 一更新就会自动上线，由用户把 `next` 合并过去。
- 项目不使用 React、Tailwind 或组件库。

## 开始之前

- 先读 `ARCHITECTURE.md`，了解目录职责和数据流向。
- 做 Labs 工具时，读 `src/content/posts/2026-10-01-编写独立HTML小工具.md`。
- 做交互文章时，读 `src/content/posts/2026-10-01-编写交互式Tech文章.mdx`。
- Astro 的 API 用法，查 Astro docs MCP。

## 开发规范

以下做法不允许：

- 绕过 `lib/posts.ts`，直接查询或过滤 `posts` 集合。
- 写死颜色值，而不用主题变量。
- 重复定义 `src/styles/ui.css` 里已有的样式。
- 为某一篇文章单独新增插件、组件或路由。
- 改变已有文章、标签、系列或 Labs 的 URL。
- 禁用 JavaScript 后，正文或链接无法使用。
- 使用 Baseline 新近可用或尚未进入 Baseline 的 CSS / JS 特性，却没有加 `@supports` 或特性检测。Baseline 广泛可用的特性可以直接用。

## 工作流程

```sh
pnpm install --frozen-lockfile
pnpm astro dev --background   # 开发服务器必须在后台运行，用 status / logs / stop 管理
pnpm check
pnpm test
pnpm build
node --test src/content/labs/<id>/core.test.js   # 只测单个 Labs 工具
```

- 每个任务从 `next` 切出新分支，命名为 `feat/<主题>`、`fix/<主题>` 或 `chore/<主题>`。
- 验证通过后再提交，提交信息遵循 Conventional Commits。
- 和当前任务无关的未提交改动，不要去动。

## 风险与限制

以下操作要先征得用户同意：

- 修改 `src/content/posts/`。
- 修改 `site.ts`、`about.ts` 里的文案和链接。
- 新增或升级依赖。
- push、合并、改写历史、`reset --hard`、`clean`，删除分支或资源文件。
- 修改部署、CI、DNS 配置，读写 `.env` 或密钥。

另外：

- 修改 schema、`lib/` 的导出或路由之前，先搜索所有调用处。
- 不要修改 `dist/`、`.astro/`、`node_modules/`。
- 命令被权限或沙箱拒绝时，停下来告诉用户，不要绕过。

## 验收标准

- `pnpm check`、`pnpm test`、`pnpm build` 全部通过，且没有新增 warning。
- 修改了 `lib/` 或 Labs 的 `core.js`，要补上对应的测试。
- 修改了外观，要截图验证深色主题、浅色主题和 375px 宽度。
- 目录结构有变化，要同步更新 `ARCHITECTURE.md`。Labs 或交互文章的规范有变化，先列出两篇教程需要改的地方，用户同意后再改。
- 汇报时说明改了哪些文件、跑了哪些验证，以及哪些没有验证、原因是什么。
