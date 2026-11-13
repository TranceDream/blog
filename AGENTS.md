# AGENTS.md

使用简体中文沟通、注释、写文档。Agent 只负责代码开发，不改文章内容。

## 1. 项目背景

- 个人博客 https://trancedre.am：Astro 纯静态站点，部署在 Cloudflare Pages。
- 分支：`next` 是开发分支，`main` 是生产分支，推送 `main` 即自动上线；`next` 由用户合并到 `main`。
- 写作与技术实验并重：Labs 小工具、交互式 Tech 文章、Markdown 插件会持续扩展。
- 不使用 React、Tailwind 或组件库。

## 2. 目录结构

- 目录职责与修改入口：`ARCHITECTURE.md`，开始任务前先读。
- 数据流：`content.config.ts` → `lib/posts.ts` → `pages/` → `layouts/` → `components/`。
- 测试：`scripts/*.test.mjs`、`src/content/labs/*/core.test.js`。
- 按任务读文档（教程以文章形式维护，`docs/` 只放入口）：
  - Labs 工具：`src/content/posts/2026-10-01-编写独立HTML小工具.md`
  - 交互文章：`src/content/posts/2026-10-01-编写交互式Tech文章.mdx`
  - Astro API：Astro docs MCP

## 3. 开发规范

以下行为视为违规：

- 绕过 `lib/posts.ts` 直接查询或过滤 `posts` 集合。
- 写死颜色值，不用主题变量。
- 重复定义 `src/styles/ui.css` 中已有的样式。
- 为单篇文章新增插件、组件或路由。
- 改变已有文章、标签、系列或 Labs 的 URL。
- 禁用 JavaScript 后正文或链接不可用。
- 使用 Baseline 新近可用或未进入 Baseline 的 CSS / JS 特性时，没有 `@supports` 或特性检测（Baseline 广泛可用的特性可直接使用）。

## 4. 执行流程

```sh
pnpm install --frozen-lockfile
pnpm astro dev --background   # 必须后台运行；用 status / logs / stop 管理
pnpm check
pnpm test
pnpm build
node --test src/content/labs/<id>/core.test.js   # 单个 Labs 工具
```

- 每个任务从 `next` 切出 `feat/<主题>`、`fix/<主题>` 或 `chore/<主题>` 分支。
- 验证通过后提交，提交信息用 Conventional Commits。
- 不碰与任务无关的未提交改动。

## 5. 风险与限制

需用户先同意：

- 修改 `src/content/posts/`。
- 修改 `site.ts`、`about.ts` 中的文案和链接。
- 新增或升级依赖。
- push、合并、改写历史、`reset --hard`、`clean`，删除分支或资源文件。
- 修改部署、CI、DNS 配置，读写 `.env` 或密钥。

其他：

- 修改 schema、`lib/` 导出或路由前，先搜索所有调用处。
- 不改 `dist/`、`.astro/`、`node_modules/`。
- 命令被权限或沙箱拒绝时，停下并告知用户，不绕过。

## 6. 验收标准

- `pnpm check`、`pnpm test`、`pnpm build` 全部通过，没有新增 warning。
- 改了 `lib/` 或 Labs 的 `core.js`，要有对应测试。
- 改了外观，截图验证：深色主题、浅色主题、375px 宽度各一张。
- 结构有变化，同步更新 `ARCHITECTURE.md`；Labs 或交互文章的规范有变化，列出两篇教程需要修改的内容，经用户同意后再改。
- 汇报：改了哪些文件、跑了哪些验证、哪些没验证及原因。
