# TranceDream’s Blog

这是 TranceDream 的个人博客，地址是 [trancedre.am](https://trancedre.am)。这里记录日常生活和技术笔记，也放一些可以直接在浏览器里使用的小工具。

## 阅读时的小功能

- **搜索**：点击页面右上角的放大镜，或按 `⌘ K`（Windows 上是 `Ctrl K`），可以搜索全站文字。
- **换配色**：点击放大镜旁边的调色盘，可以在 60 套编辑器配色之间切换，选择会保存在当前浏览器里。
- **看大图**：点击文章里的图片会放大查看，同一篇文章里的图片可以左右切换。
- **订阅**：用 RSS 阅读器订阅 [trancedre.am/rss.xml](https://trancedre.am/rss.xml)，就能收到更新。

## 在本地运行

需要先安装 [Node.js](https://nodejs.org/) 22.12 或更新的版本，以及 [pnpm](https://pnpm.io/)。然后在项目目录里运行：

```sh
pnpm install --frozen-lockfile
pnpm astro dev --background
```

浏览器打开 http://localhost:4321 就能看到博客。用完运行 `pnpm astro dev stop` 关闭。

## 致谢与许可

- 视觉风格参考了 [MultiTerm](https://github.com/stelcodes/multiterm-astro) 主题，许可见 [`licenses/MultiTerm.txt`](licenses/MultiTerm.txt)。
- 分享卡片使用了 Maple Mono 字体，许可见 [`licenses/MapleMono-OFL.txt`](licenses/MapleMono-OFL.txt)。

想了解代码结构，请看 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
