# MultiTerm × Typora

根据博客 `src/config/themes.ts` 的全部主题生成；正文配色直接复用 `src/lib/themes.ts`，代码颜色从同一 Shiki 主题映射到 Typora 的 CodeMirror 语法类别。

## 安装

1. 在 Typora 的设置 → 外观中点击「打开主题文件夹」。
2. 将需要的 `multiterm-*.css` 文件复制进去，也可以一次复制全部。
3. 重启 Typora，在主题菜单中选择 `Multiterm …`。

每份 CSS 都独立可用，无需复制 `src/`、安装依赖或连接网络。字体优先使用本机的 **Maple Mono NF CN**；请先在系统中安装该字体，未安装时自动使用系统等宽字体和中文字体。本主题包不包含字体文件，不修改 Typora 当前配置，也不自动安装。

共 60 套：42 套深色、18 套浅色。可以先试 `multiterm-catppuccin-mocha.css`（博客默认）、`multiterm-catppuccin-latte.css`（浅色）、`multiterm-nord.css` 或 `multiterm-kanagawa-wave.css`。

双击 `preview.html` 可离线切换全部配色查看排版；这是浏览器样式预览，不模拟 Typora 的编辑行为。

## 设计

- 保留每套主题的原始背景、前景、标题和链接颜色，明暗主题各自独立。
- MultiTerm 风格：等宽排版、`#` 标题前缀、`-` 列表、`>` 引用、圆角双线代码框、轻量目录与表格。
- 适配侧栏、目录、源码模式、代码光标、选区和弹出菜单。
- 标题编辑时隐藏装饰前缀，避免与 Markdown 标记重复；不改变文档内容。
- 打印/PDF 采用白底深色，避免暗色主题耗墨。

Typora 与博客的 DOM、代码高亮引擎不同，因此这是视觉适配，不是逐像素复刻。代码 token 的分类不完全一一对应；动态 MDX 组件、博客专用 directive 不会因安装 CSS 而在 Typora 中运行。

## 维护

在博客项目根目录执行（使用已有 Node 和依赖）：

```sh
node typora-themes/generate.mjs
```

公共样式只修改 `src/base.css`；配色只修改博客的主题配置。重新生成会覆盖对应的 `multiterm-*.css`，不扫描或删除其他文件。移除博客主题后，如需清理旧 CSS，请手动删除对应文件。完整清单见 `manifest.json`。

使用 `sample.md` 检查标题编辑、代码高亮、长表格、目录、脚注、任务列表、源码模式和 PDF 导出。生成器及 CSS 检查不等同于 Typora 真机验收。

## 来源

- 博客的主题列表与 Shiki / Expressive Code 配色。附 `LICENSE-shiki.txt`；各原主题的名称与作者权利仍归原作者。
- MultiTerm 视觉参考：https://github.com/stelcodes/multiterm-astro
- Typora 官方主题规范：https://theme.typora.io/doc/Write-Custom-Theme/
- Typora 代码主题规范：https://support.typora.io/Code-Block-Styles/
- 安装说明：https://theme.typora.io/doc/Install-Theme/
