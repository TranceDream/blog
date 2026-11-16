# 代码说明

## 一句话结构

这是一个 Astro 静态博客：内容集合负责校验文章，页面负责生成路由，布局负责组织页面，组件负责显示和少量浏览器交互。

```text
Markdown / MDX → content.config.ts → pages/ → layouts/ → components/ → dist/
```

## 目录职责

| 位置 | 用途 |
| --- | --- |
| `src/content/posts/` | Life、Tech、Note 内容与文章图片 |
| `src/content.config.ts` | 文章字段、类型和约束 |
| `src/pages/` | 首页、Archive、标签、系列及文章路由 |
| `src/layouts/` | 全站外壳、普通文章、交互文章布局 |
| `src/components/` | 页头、列表、目录、搜索、主题、媒体查看器等 |
| `src/lib/` | 排序、链接、日期、主题和交互展示逻辑 |
| `src/scripts/` | Note 折叠、媒体查看器等较长的浏览器行为 |
| `src/plugins/` | Markdown 扩展：提示块、图片标题、emoji 等 |
| `src/styles/ui.css` | 博客与 Labs 共用：字号、圆角、派生颜色变量（`--surface`、`--muted`、`--line` 等）和通用控件 |
| `src/styles/global.css` | 正文排版和全局基础样式 |
| `src/content/labs/` | 独立 HTML 工具、元数据和各自资源 |
| `src/features/labs/` | Labs 通用路由、资源输出、共享样式与主题同步 |
| `src/config/` | 站点信息、功能开关和主题清单 |
| `docs/` | 编写教程的链接入口；完整教程与 MDX 示例统一维护在 `src/content/posts/` |
| `licenses/` | 第三方许可证 |

## 页面生成

- 首页与 Archive 都读取 `posts` 集合，并用 `PostItem` 渲染统一时间流。
- Archive 由 `ArchivePage` 共用列表和分页，首页 `/archive/`，后续 `/archive/page/2/`；每页数量由 `SITE.archivePageSize` 控制，单页隐藏导航。Note 的搜索/RSS 链接包含所在页，旧锚点会自动定位到新分页。
- Note 只在列表内渲染 Markdown；Life 和 Tech 生成 `/archive/<slug>/`。
- 普通文章使用 `ArticleLayout`；组合式 Tech MDX 使用 `TechPostLayout + InteractiveArticle`。
- 两种文章布局共用 `ArticleHeader` 和 `PostNavigation`，只分别管理正文区域。
- `BaseLayout` 统一提供主题、元信息、页头页尾、搜索和媒体查看器。

## 统一规则

- `getVisiblePosts()` 读取集合，通过 `selectVisiblePosts()` 统一过滤草稿并按时间倒序排列；开发环境包含草稿，生产构建排除。过滤、分页和链接规则在 `scripts/posts.test.mjs` 中验证；`groupPostsByTag()` 供标签列表和标签详情页共用。
- 标签在内容校验时归一化：全半角统一、小写、去首尾空格、空白转连字符、去重；显示与 URL 使用同一个名称。
- 阅读时长由 `remark-reading-time` 从解析后的文字与代码示例估算，排除 MDX 导入和表达式；列表与详情读取同一结果。
- 弹窗外观使用 `.site-dialog`，开关与滚动锁使用 `lib/dialog.ts`。
- 交互展示背景按滚动位置更新，每帧最多计算一次；不依赖可见比例继续变化。
- 交互展示面板由 `remark-interactive-panels` 留在正文原位，禁用脚本时按单栏文章穿插阅读；启用脚本时由 `InteractiveArticle` 的内联脚本在首次绘制前移入舞台。

## 常用修改入口

- 写文章：`src/content/posts/`
- 增加小工具：`src/content/labs/<id>/`，参考 `docs/how-to-write-labs.md`
- 改站点信息或启用 Labs：`src/config/site.ts`
- 调整主题：`src/config/themes.ts`、`src/lib/themes.ts`
- 改正文样式：`src/styles/global.css`
- 增加 Markdown 语法：`src/plugins/` 并在 `astro.config.mjs` 注册
- 改路由：`src/pages/`

## 改进余地

1. Markdown 样式继续增长时，再从 `global.css` 拆出正文样式。
2. 引入客户端路由时，再统一交互脚本的挂载与清理生命周期。

当前不建议更换框架、引入状态管理或建立通用组件库。Labs 的独立功能目录和开关方式已经合适。
