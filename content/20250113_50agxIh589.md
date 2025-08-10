---
title: 关于"TranceDream的博客"
description: 记录一下我又开始搞博客小网站的心路历程，以及整个网站的构建过程。
tags: ["随手记", "博客"]
date: '2025-01-13T11:49:51'
---

## 碎碎念

终于！在一月八号晚上，我的第三个(?)博客问世了！而这次我也下定决定开始真正去写一些我想写的东西。

### 之前的博客

这次在开发之前，我先简单复盘了一下之前的两版博客系统。

第一版是用hexo去搭建的一个静态博客，搭建这个的主要原因其实很简单，就是想有一个在各个地方都能看我写的笔记的这样一个网页。

当时我还在读大二，大一的时候在学校工作室接触到了markdown这么个东西，用过之后发现这东西非常适合我用来记一些课堂笔记和开发文档，即刻下载了Typora，大二的整个操作系统课程笔记我全部使用md来记，虽然说最后脑子里确实也没留下什么东西，至少在硬盘里是存了几kB。

markdown这个东西对软件专业的同学实在是太友好了，每天上课带电脑，直接听到什么记什么，代码也能直接格式化，也不需要调整样式。但是md有一点比较痛苦，就是这东西很难在多个设备上同步，之前上课的时候就在和同学安利md做笔记，得到回复：“OneNote可以云同步”。他说的是对的，虽然说软件专业基本上离不开电脑，但是有些场景下确实存在着云端浏览的需求，比如期末考试前往考场走的时候，我感觉这几分钟内的复习效率才是巅峰，能在手机上打开笔记边走边看实在是方便。

后面经过一顿调研，最后决定用hexo配合github pages整一个个人博客。博客内容直接把笔记加上一些frontmatter就搬过来，样式也搞的非常花里胡哨，主题使用[hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly)，搭配上一些live2d纸片人。最后效果嘛，不管别人看起来觉得怎么样，自己看起来倒是很乐呵，手机上也能在网页右下角摸小芙兰头实在是赞👍。

到了大三的时候，人人卷考研，所以我决定直接准备找工作，少走三年弯路（。可能也是因为客户端做的实在是不太顺心，原生Android概念太复杂，Flutter当时还处于起步阶段并不成熟，我还是决定转做前端了。那既然选择了这条路，就得有些能拿出手说说的项目，不然实在难以混过面试难关，毕竟有项目就可以问项目，没项目就只能问八股，让人背的头疼啊。在这个背景下，我开始从头搞我的博客，也就是第二版博客。

第二版博客的重心就不在浏览使用上了，我将重心更多放在体现技术水平上，搞很多花活。比如当时非常前卫的SSR，直接用Next.js撸；css特效也加满，什么视差滚动毛玻璃都往上搞；代码层面虽然没有啥特别复杂的逻辑和创新点，但是尽量写的挺工整。最后导致博客看起来有点四不像的意思，有的地方非常简洁大方，有的地方特效过猛，甚至会出现较为严重的性能问题。这种项目写在简历上实属不妥，最后还是决定弃用了。

### 现在的博客

至于为什么我突然又把博客捡起来了，主要还是有三点原因吧。

首先是社交圈子的结构调整，少了可以倾诉日常的聊天对象，把想说的话积压起来对自己的精神状态一定会有影响，所以我还是觉得要有一个地方来记录一下自己的日常（这个说的似乎有些过于隐晦了`流汗滑稽.gif`）。

另外一个原因是工作方面的，自从转型做策略算法工作之后，工作的物理强度明显下降，但是精神压力也大幅提升，这就导致上班时间虽然没干什么活，但是非常折磨。唉！真的怀念之前在公司当前端时候的忙碌又开心的生活节奏啊～呃，好像之前也不是前端。反正截至目前的情况就是这样，上班能挤出不少空余时间来发牢骚。抒发一下策略做负时的绝望，有利于自己的身心健康`流汗滑稽.gif`。

最后一个原因就是自我成长，虽然说搞一个博客网站并不能带来什么实质性的能力提升，但是至少能起到一个自我监督的作用。我本人是和自律二字不怎么沾边的，而且三分钟热度，这次搞这个博客竟然能搞出一个能用的东西我觉得就比较可贵了，好不容易没烂尾啊（。偶尔发一些小的生活记录，也能让自己及时发现之前的问题，捡起之前想要养成但是最后被遗忘的习惯。当然提升表达能力也是比较重要的一个点，多写东西一定会在某种程度上提升表达能力，等到了季度汇报的时候不至于词穷。

## 博客开发记录

一开始想写这个文档的时候其实就是想把开发记录多写一些，结果没想到上面瞎扯的内容竟然写了不少，哈人，，，

还是赶快进入正题，把博客开发的流程和一些点记下来，不然后面突发奇想打算迭代的时候真的会两眼一黑（上一个博客弃坑也有这方面的原因）。

### 技术选型

提到做博客的话，我感觉大多数人一定会想到WordPress或jekyll、hexo、hugo这种静态站点生成工具。考虑到WordPress需要云服务器，我的家用小server的可靠性实在是难以支撑这东西稳定运行，而且ip地址变化的话ddns并不能做到立刻更新，这个方案就不在考虑范围内了。静态站点生成器其实很符合我的需求，之前用hexo的时候感觉使用体验非常良好，主题选择也不少，不过我想这些静态站点生成器还是有些“拘束”，也就是所谓的“opinionated”，扩展一些功能不是特别方便，存在较高的学习成本，我期望还是要有一些能够放飞自我的空间，加一些完全没有用但是好玩儿的小东西。

所以我考虑从前端脚手架开始搞，借助ChatGPT提效，开发效率还是很高的，不比研究配置hexo主题差。对比了几个常用的SSR或静态前端框架，最后发现还是Next.js比较合适，原因有几点：

- Next.js是SSR框架，Vercel可以直接部署Next.js应用，这个非常吸引人；
- App Router特性比较成熟，相比之前Next.js 13的时候，开发体验有了巨幅提升，至少不会说好多特性要用的时候发现还WIP，，，；
- 对我来说学习成本比较低，我是React阵营的前端仔，直接上手Next.js门槛比较低，而且之前我也用Next.js撸过一些小的项目，虽然是Pages Router，不过开发体验没有特别明显的区别。

果断Next.js搞起～

语言上还是选择了Typescript，我个人其实是偏好Javascript + JsDoc的，不过Typescript在企业中的覆盖率还是太广了，多写写对工作也是有帮助的。而且在前公司写了一年ts之后，我发现类型体操其实也没有那么乱，搞个博客系统用不到特别复杂的东西。

至于样式框架，Css-Modules对我来说是不错的选择。现在比较流行的TailwindCSS也非常不错，但是我不太喜欢它在我的tsx里面倒垃圾，写的时候非常爽，维护的时候很困扰，可能需要购买一个43寸的超长带鱼屏（。还是决定用Css-Modules配合Sass来维护样式。Sass的嵌套特性增强了样式表的可读性和开发效率，我选择Sass主要也是这个原因，Css3现在也在搞原生的Nesting，不过浏览器支持率太低啦。

### 源码说明

#### 项目结构

项目采用Next.js的App Router架构，页面目前只有四个，也只想到四个：主页、归档、关于、文章内容页。组件有文章入口组件和导航栏组件、以及一个nprogress-bar的包装组件。目录结构如下：

```markdown
.
├── app
│   ├── about
│   │   ├── page.tsx
│   │   └── page.module.scss
│   ├── archive
│   │   ├── page.tsx
│   │   └── page.module.scss
│   ├── blog
│   │   └── [slug]
│   │       ├── page.tsx
│   │       └── page.module.scss
│   ├── layout.tsx
│   ├── global.scss
│   ├── page.tsx
│   └── page.module.scss
├── components
│   ├── article-entry.tsx
│   ├── article-entry.module.scss
│   ├── nav-bar.tsx
│   ├── nav-bar.module.scss
│   └── progress-bar-provider.tsx
├── types
│   └── article.d.ts
├── utils
│   ├── markdown.ts
│   ├── mixins.scss
│   ├── new.mjs
│   └── touch.mjs
└── content
    └── *.md
```

#### Layout

全局的Layout非常简单，body中直接容纳`NavBar`和子元素。样式限制了最小高度为`100vh`，这样能确保随便点开一个页面都能完整的展示背景图，看起来更像一个网站，而不是一篇文稿。y轴溢出行为直接设置成了`scroll`，避免页面突然出现滚动条时出现的背景图大小变化（其实应该可以更改滚动条position设置？）。

```scss
:root {
  font-size: 18px;
  font-family: var(--font-crimson-pro), var(--font-noto-serif-sc), serif, sans-serif;

  color: whitesmoke;

  background: url("/background.jpg") no-repeat fixed, linear-gradient(150deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%) no-repeat fixed;
  background-size: cover;
  background-position: center;

  body {
    margin: 0;

    min-height: 100vh;

    overflow-y: scroll;
  }

  ::selection {
    background: burlywood;
  }
}
```

全局字体设置成了18px的大小，看起来没那么费眼。字体选择就纯属个人爱好了，我这次在正文使用了衬线字体，给人有一种纸面媒体的感觉，拉丁字符使用Crimson Pro字体，中文字符使用Noto Serif SC，等宽文字使用JetBrains Mono。字体都是通过变量的方式导入，并非直接使用字体对应的className。

```typescript
className={[
    fontCrimsonPro.variable,
    fontNotoSerifSC.variable,
    fontJetbrainsMono.variable,
].join(' ')}
```

#### 主页

受之前使用的博客主题的影响，我后面设计主页时都会加一个整屏的封面，里面只放博客标题和下面的slogan。不过现在的主页也只有一个封面的作用，目前还没想到要在主页上放什么东西，可能要放一个随机贴文推荐？也可能搞点什么友情链接之类的？甚至是二次元（不行。

```typescript
export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <h1>TranceDream的博客</h1>
        <p>After we're gone, the spirit carries on.</p>
      </section>
    </main>
  )
}
```

#### 归档

归档页面显示了所有的文章信息，就是一个`ArticleEntry`的列表。分页本来是做了，不过实在想不到该怎么让分页器的样式变得好看，结合我现在的贴文数量，最后我决定先把分页器删了，以后文章数量多了再想办法搞吧，第一版嘛，功能就不搞太多了，能用就够啦。

```typescript
export default function ArchivePage() {
  const posts = getAllPosts()

  return (
    <main className={styles.main}>
      <h1>Archive</h1>
      <ul>
        {posts.map(article => (
          <ArticleEntry key={article.slug} article={article} />
        ))}
      </ul>
    </main>
  )
}
```
#### 正文

正文页也是由一个整屏的封面开头，我把标题和描述等文章元数据都放在封面的左下角，这样可以一点进来就直接把封面甩在脸上，毕竟下面看文章的时候就看不见背景图了。文章内容部分我使用了纯白色底板，而不是中间的一块儿文章内容两边透明，这样能不能起到让人专注于内容的效果呢？

内容样式由ChatGPT强力驱动，看起来确实还比较美观，比Gayhub的默认样式要好看一点点儿。这次内容没有使用`ReactMarkdown`这类组件渲染，而是直接插入html内容，可能定制化空间会大一些吧。

```typescript
export default async function BlogPage({ params }: BlogPageParams) {
  const { slug } = await params
  const article: Article = await getPostData(decodeURIComponent(slug))

  return (
    <main className={styles.main}>
      <section
        className={styles.header}
        style={{
          background: article.cover ? `url('${article.cover}')` : 'unset',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1>{article.title}</h1>
        <p className={styles.date}>
          {dayjs(article.date).format('YYYY-MM-DD')}
        </p>
        <p className={styles.tags}>
          {article.tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        <p>{article.description}</p>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  )
}
```

#### utils

utils里面东西不多，但是比较杂。markdown.ts包含了处理md和文件读取的一些方法；mixins.scss定义样式mixin，主要是响应式处理的封装；new.mjs用来创建新的帖子，提供一个交互式的脚本，省的自己编写frontmatter了；touch.mjs提供了一个快速更新文件日期的功能，主要解决的问题是发布时文章日期与创建文件的日期相差太远，用dayjs更新要比手动填写要更准确。

### 后续规划

现在这博客完全是一个初版原型的形态，后面要迭代的功能实在是不少，目前能想到的我先列在下面吧。

- [ ] 想想About页面能放什么东西，要不把我的简历搞里头？
- [ ] 主页下面放什么功能呢？我觉得可以先整一个最新文章x3
- [ ] 归档的分页器想想怎么设计，代码都有，研究一下怎么写样式
- [ ] 现在文章tags还没啥用，要不要搞个分tag页面
- [ ] 添加更多语法支持，如LaTeX、GFM、Mermaid等
- [x] 上面的文字里掺杂了好多`流汗滑稽.gif`这种“表情占位符”，我希望最好有一个自定义的表情语法可以实现无痛插入表情图
- [ ] 添加评论区，看看Gitalk能不能整一个
