# 代码结构

这是一个用 Astro 生成的纯静态博客。构建时，Markdown 文件经过校验和插件处理，再由页面、布局和组件拼成 HTML，最终输出到 `dist/`。浏览器端只有少量脚本，负责搜索、换配色、看大图和交互文章这类增强功能；即使脚本没有运行，页面内容也是完整的。

```text
src/content/posts/*.md(x)
  → content.config.ts   校验字段
  → lib/posts.ts        过滤草稿、排序、生成链接
  → pages/              决定生成哪些页面
  → layouts/            搭出页面骨架
  → components/         渲染具体内容
  → dist/               静态文件，Pagefind 再为它建立搜索索引
```

## 目录

| 位置 | 作用 |
| --- | --- |
| `astro.config.mjs` | 站点地址、Markdown 插件顺序和集成（MDX、sitemap、Expressive Code、Labs） |
| `src/content.config.ts` | 两个内容集合：`posts`（文章和短日志）和 `labs`（小工具说明） |
| `src/content/posts/` | 所有文章、短日志及配图 |
| `src/content/labs/<id>/` | 每个小工具一个目录，放 `index.md` 说明、`index.html` 页面和各自的脚本、样式 |
| `src/config/` | 站点信息与功能开关（`site.ts`）、About 页内容（`about.ts`）、配色清单（`themes.ts`） |
| `src/lib/` | 不依赖页面的逻辑：文章查询与链接、标签规范化、摘要、配色解析、弹窗、交互文章的切换 |
| `src/pages/` | Astro 的文件路由，每个文件对应一类页面 |
| `src/layouts/` | 页面骨架：全站外壳、普通文章、交互文章 |
| `src/components/` | 页头页脚、列表项、目录、搜索、配色切换、媒体查看器等组件 |
| `src/scripts/` | 篇幅较长的浏览器脚本：短日志折叠、媒体查看器 |
| `src/plugins/` | 自定义 Markdown 语法和编译检查 |
| `src/features/labs/` | Labs 功能：注入路由、输出工具文件、共享样式和配色同步 |
| `src/styles/` | `ui.css` 放博客和 Labs 共用的字号、颜色变量和控件；`global.css` 放正文排版；`scrollbars.css` 放滚动条 |
| `scripts/` | Node 测试，Labs 工具的测试放在各自目录的 `core.test.js` |
| `docs/` | 只放两篇教程的链接入口，教程正文本身是 `src/content/posts/` 里的文章 |
| `licenses/` | 第三方许可证 |

## 内容与页面

文章的 `type` 决定它怎么显示，但它们都属于同一条时间线：

- `life` 和 `tech` 生成独立页面 `/archive/<id>/`。
- `note` 不生成独立页面，正文直接渲染在 Archive 列表里，链接指向 `/archive/#note-<id>`，翻页后也能定位到。
- `draft: true` 的内容只在开发服务器中显示。生产构建会把它从所有列表、详情页、搜索、RSS、sitemap 和分享图里去掉。

所有页面都通过 `lib/posts.ts` 取内容。`getVisiblePosts()` 统一负责草稿过滤和排序，`postHref()`、`tagHref()` 等函数负责生成链接，所以 URL 规则只有这一处。

| 路由 | 文件 | 内容 |
| --- | --- | --- |
| `/` | `pages/index.astro` | 个人介绍和最近 3 条内容 |
| `/archive/`、`/archive/page/<n>/` | `pages/archive/index.astro`、`page/[page].astro` | 时间线及分页，列表由 `ArchivePage` 渲染，每页条数由 `SITE.archivePageSize` 决定 |
| `/archive/<id>/` | `pages/archive/[...slug].astro` | 文章详情，根据 `presentation` 选择布局 |
| `/tags/`、`/tags/<tag>/` | `pages/tags/` | 标签列表和按标签筛选 |
| `/series/<name>/` | `pages/series/[series].astro` | 按系列筛选 |
| `/about/` | `pages/about.astro` | 读取 `config/about.ts` |
| `/labs/`、`/labs/<id>/` | 由 `features/labs` 注入 | 小工具列表和工具页 |
| `/rss.xml`、`/robots.txt` | `pages/rss.xml.ts`、`robots.txt.ts` | 订阅源和爬虫规则 |
| `/social-cards/<id>.png` | `pages/social-cards/[...slug].png.ts` | 构建时用 Satori 生成的分享图，文章没有头图时使用 |

## 布局

- `BaseLayout` 是所有页面的外壳，负责 `<head>` 元信息、页头页脚、搜索弹窗和媒体查看器。它还会在页面绘制之前读取保存的配色，避免页面先闪一下默认配色。
- `ArticleLayout` 用于普通文章，`TechPostLayout` 用于 `presentation: composed` 的交互文章。两者都用 `ArticleHeader` 显示标题信息、用 `TableOfContents` 显示目录、用 `MorePosts` 显示相邻文章，区别只在正文区域。

## 几个关键机制

**配色。** `config/themes.ts` 列出 60 套 Shiki 主题。代码高亮直接使用这些主题；`lib/themes.ts` 再从同一套主题里提取页面的背景、文字和强调色，所以页面和代码块的颜色总是一致的。`ui.css` 在这些基础颜色上派生出 `--surface`、`--muted`、`--line` 等变量，组件只使用这些变量，不写死颜色。

**搜索。** 开发时直接搜索内容集合；构建后由 Pagefind 为最终的 HTML 建立全文索引，第一次打开搜索时才加载，加载失败时可以重试。

**Markdown 插件。** `astro.config.mjs` 里的插件按顺序执行。除了公式、emoji、标题锚点这些常见功能，`src/plugins/` 还提供提示块、图片标题、像素图、角色对话和 GitHub 卡片。`remark-reading-time` 负责计算阅读时长，同时从正文提取一段纯文本摘要，供短日志的 RSS 条目使用。顺序上要注意，`remark-interactive-check` 必须排在 `remark-interactive-panels` 之前，才能检查到作者原本写的结构。

**交互文章。** 作者在 `.mdx` 里每个 H2 后面写一个 `<section slot="display" data-stage-panel>`，构建时 `remark-interactive-panels` 把这些面板留在正文原位。页面加载时，`InteractiveArticle` 的内联脚本在首次绘制前把面板移到旁边的展示区，`lib/articleStages.ts` 再根据滚动位置切换当前显示的面板。没有 JavaScript 时，面板以卡片形式穿插在正文里，页面顶部会显示一条提示。如果 H2 和面板的数量对不上，或者面板没有直接放在 `InteractiveArticle` 里，`remark-interactive-check` 会在编译时输出带文件路径的 warning，但不会中断构建。

**Labs。** 每个工具是一个完整的独立 HTML 页面。`features/labs` 把工具目录里的文件输出到 `/lab-artifacts/<id>/`，并在 HTML 的 `<head>` 里插入 `shared.css` 和 `theme-bridge.js`，然后在 `/labs/<id>/` 页面里用 iframe 嵌入。这样工具的样式和脚本不会影响博客，而且能跟着博客一起换配色。工具里的纯逻辑写在 `core.js`，方便单独测试。在 `site.ts` 里关闭 `features.labs`，整个 Labs 就不会生成。

## 构建与依赖

- `pnpm build` 先由 Astro 生成 `dist/`，再通过 `postbuild` 运行 Pagefind 建立索引。日期统一按 `SITE.timeZone` 显示，结果不受构建机器所在时区影响。
- pnpm 版本由 `package.json` 的 `packageManager` 固定，Node 需要 22.12 或更新的版本。Cloudflare Pages 不会读取这两项要求，需要在项目的环境变量里设置 `PNPM_VERSION` 和 `NODE_VERSION`。
- `pnpm-workspace.yaml` 只用来覆盖个别依赖的版本，项目本身不是多包结构。KaTeX 统一使用 0.19.1，保证公式插件和样式来自同一个版本，`pnpm test` 会检查这一点；Satori 的解压依赖 fflate 固定为修复后的 0.7.5。升级相关上游包时，记得看看这些覆盖还需不需要。
- TypeScript 暂时停在 6.x，因为 `@astrojs/check` 还没有声明支持 7.x。

## 测试

`pnpm test` 会运行 `scripts/*.test.mjs` 和各个 Labs 工具的 `core.test.js`，覆盖草稿过滤、排序、分页、短日志链接、摘要提取、公式渲染、交互面板插件和各个工具的逻辑。`pnpm check` 负责类型检查。

## 常见修改从哪里入手

- 新增一种 Markdown 语法：在 `src/plugins/` 写插件，再到 `astro.config.mjs` 注册。
- 调整正文样式：`src/styles/global.css`；调整通用控件和字号：`src/styles/ui.css`。
- 增加或删除配色：`src/config/themes.ts`。
- 新增小工具：在 `src/content/labs/` 下建目录，不需要写路由。
- 新增页面类型：在 `src/pages/` 加路由，内容一律通过 `lib/posts.ts` 获取。
