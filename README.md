# TranceDream’s Blog

正式站点地址为 `https://trancedre.am`，集中配置在 `src/config/site.ts`；Astro 的 `site`、canonical、分享地址、RSS 和 robots.txt 使用这一配置。

- `/rss.xml`：已发布文章和 Notes 的摘要订阅；草稿不进入订阅。
- `/sitemap-index.xml`：构建时自动生成站点地图。
- `/robots.txt`：允许抓取并声明站点地图；404 页面设置为不收录。
- 分享图片优先使用文章头图；没有头图时，Life/Tech 使用构建生成的 `/social-cards/<id>.png`，其他页面使用 `/social-cards/__default.png`。模板位于 `src/pages/social-cards/[...slug].png.ts`，头像、作者和配色读取站点配置与默认主题。中文字体仅在构建时使用，许可见 `licenses/MapleMono-OFL.txt`。
- 计划使用 Cloudflare Pages，仍为纯静态输出：构建命令 `npm run build`，产物目录 `dist/`。尚未配置或执行部署，DNS、自定义域名绑定和重定向留待上线时处理。

一个静态优先的 Astro 个人博客。视觉语言来自 MultiTerm：编辑器主题色、Markdown 标题符号、平面文章流和克制的边框；内容宽度则按文章用途变化。

简要代码地图与改进建议见 [`ARCHITECTURE.md`](./ARCHITECTURE.md)。

交互文章编写教程与完整 MDX 示例保留在 [`docs/how-to-write-interactive-articles.mdx`](./docs/how-to-write-interactive-articles.mdx)，不参与站点构建。需要预览时可复制到 `src/content/posts/` 并将 `draft` 改为 `false`。

现有测试文章、Notes、Labs 示例及演示素材已备份到项目外并清理。当前内容以 `src/content/` 为准。MultiTerm 许可保留在 [`licenses/MultiTerm.txt`](./licenses/MultiTerm.txt)。

## 个人介绍与社交链接

在 `src/config/site.ts` 编辑 `profile`：`avatar` 为 `public/` 下的图片地址（当前 `/avatar.webp`），`avatarAlt` 为替代文本，`greeting` 为开场白，`bio` 每一项是一段简介。头像留空即可隐藏。

`socials` 控制页脚图标、顺序和地址，支持 `github`、`twitter`、`email`、`rss` 和通用 `link` 图标；每项填写 `label`、`href`、`icon`。邮箱填写一次 `mailto:`，删除条目或留空地址即可隐藏。

## 写作内容

所有文章与短日志都放在 `src/content/posts/`，由 `src/content.config.ts` 统一校验。`type` 只决定内部渲染方式，不再对应公开分区：

```yaml
---
type: life # life | tech | note
title: 一篇文章 # note 可省略
description: 列表和分享摘要
publishedAt: 2026-08-26
author: tranced # 可选
series: Astro Notes # 可选
tags: [example]
draft: false
toc: true
presentation: composed # 仅组合式 MDX Tech 文章需要
---
```

- `life`：使用普通文章布局，详情地址为 `/archive/<id>/`。
- `tech`：默认使用普通文章布局；需要交互展示时使用 `.mdx`、`presentation: composed` 与通用 `InteractiveArticle`，详情同样位于 `/archive/<id>/`。
- `note`：不生成独立详情页；可不写标题，Markdown 正文直接显示在 `/archive/`，较长内容会折叠并可原位展开，规范链接为 `/archive/#note-<id>`。
- `labs`：独立 HTML 小工具展示，目前包含健康计算与 JSON 工具。

公开导航包含 Home、Archive 和可选的 Labs。Archive 是所有写作内容唯一的时间归档；标签与系列页面只是这条内容流的筛选视图。

Labs 由 `src/config/site.ts` 中的 `features.labs` 控制。每个工具放在 `src/content/labs/<id>/`，包含 `index.md`、`index.html` 及其资源；博客自动生成列表与页面，注入共用样式并同步主题。详见 [`docs/how-to-write-labs.md`](./docs/how-to-write-labs.md)。

## 结构边界

```text
src/
├── components/       # 可复用的静态 UI 与交互展示
├── config/           # 站点级配置
├── content/          # Markdown 内容
├── layouts/          # 普通文章与组合式 Tech 两种布局
├── lib/              # 路由、日期、排序等纯函数
├── pages/            # Astro 文件路由
└── styles/           # 全局主题变量与文章排版
```

项目刻意不预装 React、Tailwind 或 shadcn/ui。真实交互需求出现后，再把单个 React Island 放进 `components/`；静态文章与页面不会因此被整体水合。

项目默认只在本地运行和构建，不包含任何托管平台绑定或自动部署流程。

## 主题、搜索与正文渲染

- Header 右侧按 MultiTerm 的顺序放置搜索与主题入口，均为融入标题色带的图标按钮。
- 首页显示 Archive 的最新条目；Archive 按发布时间混排长文和短日志，并共用同一个列表组件。
- 主题注册表位于 `src/config/themes.ts`，包含 MultiTerm 当前的 60 套 Shiki 主题；页面语义色、代码高亮和选择器中的三色色块来自同一份配置。
- `⌘/Ctrl + K` 打开搜索。开发服务器使用内容集合的本地搜索，`npm run build` 后由 Pagefind 为最终 HTML 建立全文索引。
- Markdown/MDX 支持标题锚点、h2/h3 目录、Expressive Code、表格、任务列表、脚注、图片标题、像素图、五类提示块、数学公式、emoji、角色对话与 GitHub 卡片。
- 组合式 Tech 文章把正文与展示内容写在同一个 `.mdx` 文件中；页面无需注册专属展示组件。
- Markdown 正文图片与文章头图会自动接入全站媒体查看器，同一篇文章内可前后切换；显式写成 `<video data-media-viewer>` 的视频也会获得查看器入口。可用 `data-media-viewer="off"` 排除单个媒体。
- 标签与系列分别生成 `/tags/.../` 和 `/series/.../` 页面；普通文章显示相邻文章导航。

## 开发

```sh
npm install
npm run astro -- dev --background
npm run build
```

后台开发服务器可用 `npm run astro -- dev status`、`npm run astro -- dev logs` 和 `npm run astro -- dev stop` 管理。

主题选择保存在浏览器本地；旧版的 Mocha、Kanagawa 和 Latte 偏好会自动迁移到对应的新主题 ID。构建命令只生成本地 `dist/` 与 Pagefind 索引，不包含发布步骤。
