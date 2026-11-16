# TranceDream’s Blog

这是 TranceDream 的个人博客，地址是 [trancedre.am](https://trancedre.am)。这里记录日常生活和技术笔记，也放一些可以直接在浏览器里使用的小工具。

## 站点里有什么

- **首页**：头像、简短的自我介绍，以及最近更新的几条内容。
- **Archive**：所有内容的时间线，长文和随手记的短日志按发布时间排在一起。
- **Labs**：独立的小工具，比如 JSON 工具箱、健康计算器和日历复制器，打开就能用。
- **About**：更详细的自我介绍、兴趣爱好和友链。
- **标签与系列**：点击文章上的标签或系列名，可以只看相关的内容。

## 阅读时的小功能

- **搜索**：点击页面右上角的放大镜，或按 `⌘ K`（Windows 上是 `Ctrl K`），可以搜索全站文字。
- **换配色**：点击放大镜旁边的调色盘，可以在 60 套编辑器配色之间切换，选择会保存在当前浏览器里。
- **看大图**：点击文章里的图片会放大查看，同一篇文章里的图片可以左右切换。
- **订阅**：用 RSS 阅读器订阅 [trancedre.am/rss.xml](https://trancedre.am/rss.xml)，就能收到更新。
- **交互文章**：部分技术文章旁边有一块展示区，会跟着阅读位置切换内容。浏览器关闭了 JavaScript 也能正常阅读，展示内容会按顺序穿插在正文里。

## 内容是怎么写的

每篇内容都是一个 Markdown 文件，放在 `src/content/posts/` 里，文件名写成 `日期-标题.md`。文件开头有一小段说明，比如：

```yaml
---
type: life          # life 是生活文章，tech 是技术文章，note 是短日志
title: 文章标题      # 短日志可以不写
description: 一句话简介，会显示在列表和分享卡片里
publishedAt: 2026-11-02
tags: [日常]
draft: false        # 写成 true 就只在本地预览里出现，不会发布
---
```

内容分三种：

- **生活文章（life）和技术文章（tech）** 会有自己的页面。
- **短日志（note）** 直接显示在 Archive 列表里，较长的会折叠起来，点击就能展开。
- **交互文章** 是带展示区的技术文章，写法见博客里的[《编写交互式 Tech 文章》](src/content/posts/2026-10-01-编写交互式Tech文章.mdx)。Labs 小工具的写法见[《编写独立 HTML 小工具》](src/content/posts/2026-10-01-编写独立HTML小工具.md)。

## 修改个人信息

- 头像、问候语、简介和页脚的社交链接，在 `src/config/site.ts` 里修改。
- About 页的详细介绍、兴趣和友链，在 `src/config/about.ts` 里修改。新增一个友链，只要照着已有的格式补上名字、地址和简介即可。

## 本地预览与发布

在电脑上预览，需要先安装 [Node.js](https://nodejs.org/) 22.12 或更新的版本，以及 [pnpm](https://pnpm.io/)。然后在项目目录里运行：

```sh
pnpm install --frozen-lockfile
pnpm astro dev --background
```

浏览器打开 http://localhost:4321 就能看到博客，草稿也会显示出来。用完运行 `pnpm astro dev stop` 关闭。

修改先在 `next` 分支上完成，确认没问题后合并到 `main`。`main` 一更新，Cloudflare Pages 就会自动构建并发布到线上。

## 致谢与许可

- 视觉风格参考了 [MultiTerm](https://github.com/stelcodes/multiterm-astro) 主题，许可见 [`licenses/MultiTerm.txt`](licenses/MultiTerm.txt)。
- 分享卡片使用了 Maple Mono 字体，许可见 [`licenses/MapleMono-OFL.txt`](licenses/MapleMono-OFL.txt)。

想了解代码结构，请看 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
