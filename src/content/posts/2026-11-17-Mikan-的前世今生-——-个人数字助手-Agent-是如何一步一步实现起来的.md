---
type: tech
title: "Mikan 的前世今生 —— 个人数字助手 Agent 是如何一步一步实现起来的"
description: "从 Telegram 收到一条消息开始，记录我怎样给 Mikan 接上工具、历史记忆和定时任务，以及为什么把代码执行放进 Docker 沙箱。"
publishedAt: "2026-11-17T18:18:54+08:00"
tags: [Mikan]
draft: true
toc: true
---

:::note[TLDR]
Mikan 是我用 Node.js + TypeScript 手撸的个人数字助手 agent，接入 Telegram，能管理文件、记住历史消息、执行定时任务，并在 Docker 沙箱里运行代码。本文记录它的设计思路和实现细节。
:::

## Mikan 这个项目的背景

2026 年，Agentic AI 无疑是最火热最流行的前沿技术，抛开炒作的部分，我觉得**用 agent 来管理博客的内容是非常值得做的一件事**。今年八月份，我之前的博客域名刚好到期，我决定换成更酷的 domain hack 风格域名 `trancedre.am`。既然域名换了，博客的实现方式和内容也要更酷，正好可以手撸一个 agent，一边练手，一边让博客变得 agentic。

Agent 的优点，就是利用 LLM 作为基座，灵活地覆盖传统编码覆盖不到的功能领域。拿一个简单的功能举例：我写好了一段文字，保存到一个 markdown 文档，想要整理成能直接在网页展示的带有完整 frontmatter 元数据的文档：

- **手动做**：要手写 frontmatter，还要自己总结 tags 和摘要；
- **代码自动化**：只能解决格式问题，内容相关的部分还得人或 LLM 介入，而且功能越多，代码量越大；
- **交给 agent**：LLM 可以同时接管 frontmatter 的修改和内容的生成，代码只需要做简单的校验。

除了博客，我觉得 agent 在其他场景也很有潜力，目前想到的有这几个：

- **NAS 管理**：让 agent 接管我的 NAS，我出门在外的时候，可以通过 IM 来让 agent 帮我整理搜索文件。
- **智能家居**：让 agent 接管智能家居，把我家里的智能家电，数据收集装置接入 HomeAssistant，然后通过 agent 对家里的状况进行监控，甚至远程操作。
- **资讯日报**：让 agent 来整理一些日报周报类的文档，比如每天定时从网络上采集最新最热的 AI 资讯，整理成我想要的格式，发布成文档，或者通过 IM 发送给我。

![Agent连接四大数字场景](https://img.trancedre.am/images/20261120175658290.png)

## 运行基础与技术选型

我选择的技术栈如下：

| 用途 | 选型 |
|---|---|
| 运行环境 | Node.js + TypeScript |
| Telegram 接入 | grammY |
| Agent 执行层 | OpenAI Agents SDK |
| 参数与配置校验 | Zod |
| 历史消息存储 | SQLite |

这里之所以使用 Telegram 就是因为它好用且好写，而且我平时也会用它来浏览一些模拟器/工具社区，还有游戏查分机器人，比较贴合我的日常使用场景。

在我的项目里面，**并不是所有消息都会进入 agent 执行**。在接收到消息后，我会根据消息的内容和上下文进行判断，命中命令或固定交互场景的消息，会直接走对应的代码逻辑，比如群聊里检测到社交媒体链接，就走链接解析；没有命中的消息，才交给 agent 处理。

![Architecture](https://img.trancedre.am/images/20261120175658291.svg)

## 工具与技能

### 原子化的工具

Agent 通过工具与外界的环境交互，为了实现需求，就需要合理设计工具。如果我按照需求来区分工具，每做一个小功能都提供一个工具出来，最后我的 agent 一定会变成各种记账工具、日常记录工具、博客整理工具的大合集……

我的想法是将这些需求拆解成原子级的能力，比如日常记录工具和记账工具，本质上都是通过向文件中写入内容和读取内容来实现功能，那就直接设计一套通用的文件系统操作工具，直接给 agent 提供最基础的能力。

:::tip[设计原则]
不按需求造工具，而是把需求拆解成原子级的能力。新增功能时，往往不需要写新工具，只需要告诉 agent 怎么组合已有的能力。
:::

![原子能力](https://img.trancedre.am/images/20261120175658292.webp)

现在的 Mikan 里面集成有文件、消息、历史、时间、配置、定时任务和待答队列等基础工具，如果靠这些工具解决不了，我还开放了 `execute_node` 工具，让 Mikan 直接执行 Node.js 脚本。

:::菲比注意{align="right"}
让 agent 直接执行代码是很危险的！！！后文的「执行环境限制」一节会讲我是怎么给它套上限制的。
:::

### 按需加载的 Skills

**简单任务靠原子能力组合，复杂任务靠 skills 补流程**：比较简单的任务，agent 自己就可以使用这些原子能力组建流程；流程稍复杂的任务，就通过 agent skills 补上操作流程。

启动时，Mikan 会扫描项目内置的 skills 和外部装载的 skills，建立名称、描述和路径索引。模型通过索引决定需要某项技能时，再通过 `load_skill` 加载正文。

![loading skills](https://img.trancedre.am/images/20261120175658293.svg)

## 会话管理

由于 Mikan 的应用场景不局限于与我本人的私聊，也会有一些受信任的群聊消息，于是我**按照聊天 ID 对会话进行区分**。每个会话在内存里会保存若干轮，包含用户输入到最终输出之间的工具调用和结果。当会话开启下一轮时，程序会将这个会话的前面轮次作为上下文一部分拿来调用 agent。

这里我让 Telegram 接收消息的通道和 agent 的运行状态解耦：只要有符合条件的消息进来，就先放进当前聊天的待处理列表，等下一次模型调用前再注入。所以 agent 执行任务到一半时如果有新消息插进来，**它不会中断，而是在下一次调用模型时把新消息一并带上**，实现类似 steering 的效果。

![agent message timeline](https://img.trancedre.am/images/20261120175658294.svg)

## 上下文压缩

如果不对上下文的消息轮次和字数进行限制，agent 的 token 消耗会越来越大，还会容易忘记之前已经确认的事实，所以有必要设置一个上下文压缩的阈值。

我这里根据消息轮次和字符数进行限制，在下一轮模型调用开始前检查：

- **阈值**：默认 40 轮或 160k 字符，历史超过任一项的 80%（也就是 32 轮或 128k 字符）就触发压缩；
- **保留**：近期的 1 到 20 轮消息保留原文，更早的消息交给模型生成摘要；
- **图片**：图片或附件消息最多保留最近两张实际图片，更早的图片输入替换成文字提示。

![context window compaction](https://img.trancedre.am/images/20261120175658295.svg)

## 记忆机制

### 为什么需要外部存储

上下文里的摘要不可避免会丢信息，只靠它运行的话，时间一长，早期的记忆会越来越模糊。**更致命的是，上下文没有持久化，实例一重启，历史就全没了。**

### SQLite 消息存储

于是我引入了基于 SQLite 的外部消息存储。每次收到消息，会由独立的 worker 将对话内容同步到 SQLite 中，存储规则如下：

- **唯一标识**：Telegram 的 `(chat_id, message_id)`
- **保存内容**：消息正文、发送者、聊天群组、时间、回复关系、附件元数据等
- **编辑**：更新当前的快照，同时保留旧版本
- **删除**：在记录中打上删除标记
- **附件**：只存储元数据，不存储本体

想要检索的时候，使用时间、来源和类别进行快筛，结合 SQLite 的 FTS5 全文索引，这样实现了初版的消息检索功能。

### 交给 agent 的检索工具

在 agent 侧，我给 Mikan 提供四个工具：

- `list_history_chats`：列出有哪些会话来源
- `search_messages`：按条件搜索消息
- `get_message`：查看单条消息详情
- `get_message_context`：查看一条消息前后的上下文

这样一来，历史保存在数据库里，不会自动塞进上下文，只在需要时按检索结果返回，而且能跨会话查询。

> Agent 想知道过去发生了什么，自己去查就行，相当于**把使用记忆的主动权交给了 agent**。

![memory architecture](https://img.trancedre.am/images/20261120175658296.svg)

## 交互设计

我除了把记忆调用过程外包给 agent 外，**说话的权利也交给它了**。

最初的版本里，消息发送是被动的：模型回复什么，我就收到什么。后来 agent loop 逐渐完善，一次任务会调用好几次模型，每次都发消息太啰嗦；可如果只在结束时发一条，中间过程又完全是黑盒。

所以我将发送消息相关的能力也都封装成了工具：文字、媒体、按钮选单等消息发送，消息编辑和删除，消息引用。Agent 在执行过程中，会将阶段性成果通过发消息工具发送给我，而中间的详细过程就不会在 IM 输出。

| 发送方式 | 效果 |
|---|---|
| 每次模型回复都发送 | 太啰嗦 |
| 只在结束时发送 | 中间过程是黑盒 |
| Agent 通过工具主动发送 | 只发阶段性成果 |

交互能力多了之后，**提示词设计就需要克制一些**，工具什么时候使用，更多情况交给模型来判断，指令中只做基本的规则说明。

## 异步任务

除了在聊天中直接下达的任务之外，Mikan agent 还实现了定时任务。我使用 `tasks.json` 来维护一个任务列表，当我发起一轮设置定时任务的对话时，agent 会向文件中写入一个任务，记录：

- **指令**：到期后要做什么
- **时间**：可以是 cron
- **聊天 ID**：任务发生的群聊/私聊

调度器空闲时每隔一段时间会检查一下有没有到期任务，有的话就触发执行。

**执行任务使用独立的 agent 上下文**，不会自动带上日常的聊天历史，执行的结果也是通过消息发送的工具发送到 IM。

![scheduled agent workflow](https://img.trancedre.am/images/20261120175658297.svg)

## 执行环境限制

:::菲比
前面我有提到开放了一些文件操作的工具，甚至 Node.js 执行工具，可以让 agent 运行在自己电脑上修改真实的文件，那么这里 agent 所能接触的文件范围就需要严格限制。
:::

**基础文件工具**只允许访问配置好的工作目录和媒体目录，工具调用时会对路径、链接和覆盖行为进行检查。删除的操作使用回收方式，普通复制、移动、新建也有各自约束。

复杂任务由 **`execute_node` 沙箱**处理，这个工具我用了一种妙妙方法来限制：Node.js 代码执行交给一个临时的 Docker 容器，这个容器：

- 存储只挂载固定的工作目录和媒体目录，目录路径和主机路径一致
- 关闭网络
- 以非 root 身份运行
- 根文件系统只读
- 限制 CPU、内存、进程数和运行时间

## 运维工作

现在我把 Mikan 通过 pm2 部署在本机上，Telegram Bot API 部署在本机 Docker。

Mikan 的参数配置分成两个文件保存：

| 文件 | 存放内容 | 能否在运行时修改 |
|---|---|---|
| `.env` | 运行环境、模型 API 等 | 否，启动后就不修改 |
| `settings.json` | 插件并发数等 | 可以，agent 能动态调整 |

Agent 可以动态调整 `settings.json` 的内容，比如各个 Telegram 插件的并发数。文件的格式也有校验，即使 agent 修改错了，针对 `settings.json` 也有单独的备份机制可供恢复。

实例启动时，有做**单实例锁**，避免两个 Mikan 打架。退出时做一套**收尾流程**，尽量确保不会产生脏数据。

## 代码结构

:::菲比注意
由于现在的这个版本中，有大量的针对我个人的定制逻辑，以及一些群聊专属小功能，机器人功能和 agent 部分还耦合在一起，所以源代码我就不开放出来了。
:::

这里简单介绍一下代码结构：

```text
mikan/
├── src/
│   ├── index.ts                 # 程序入口
│   ├── app.ts                   # 组装服务、启动和退出
│   ├── instance-lock.ts         # 防止同一数据目录运行多个实例
│   ├── logger.ts                # 控制台日志、JSONL 日志与轮转
│   ├── diagnostics.ts           # 错误信息提取与脱敏
│   │
│   ├── config/                 # 配置与访问规则
│   │   ├── env.ts              # 环境变量与启动配置
│   │   ├── settings.ts         # 动态配置、校验、备份和更新
│   │   ├── paths.ts            # 运行数据与媒体目录定位
│   │   ├── access.ts           # 聊天权限、会话标识
│   │   ├── defaults.ts         # 默认路径
│   │   └── aria2.ts            # NAS 下载配置
│   │
│   ├── telegram/               # Telegram 接入与交互
│   │   ├── bot.ts              # 创建 Bot、中间件和后台消息处理
│   │   ├── router.ts           # 注册路由、权限检查、消息分流
│   │   ├── routes.ts           # 文本与链接的路由判断
│   │   ├── commands.ts         # /clear、/stop、/status 等命令
│   │   ├── conversation.ts     # Telegram 对话与 Agent 的衔接
│   │   ├── input.ts            # 提取文本、命令、引用和附件
│   │   ├── images.ts           # 读取可传给模型的图像内容
│   │   ├── transport.ts        # 消息、媒体与交互的实际发送
│   │   ├── payloads.ts         # 消息工具参数结构
│   │   ├── render.ts           # 格式转换、转义与分段
│   │   ├── replies.ts          # 普通文本回复
│   │   ├── message-records.ts  # 消息引用、按钮、待答事项
│   │   ├── history.ts          # Telegram 消息采集
│   │   ├── files.ts            # 附件收发适配
│   │   ├── download.ts         # Telegram 文件下载
│   │   ├── attachments.ts      # 自动保存附件
│   │   ├── api-config.ts       # 官方 / 本地 Bot API 配置
│   │   ├── status-scheduler.ts # 状态消息调度与限流
│   │   └── log-alerts.ts       # 向告警话题投递日志
│   │
│   ├── agent/                  # Agent 运行与控制
│   │   ├── mikan.ts            # 创建 Agent，执行聊天和定时任务
│   │   ├── persona.ts          # 性格与表达方式
│   │   ├── instructions.ts     # 行为规则、能力边界
│   │   ├── context.ts          # 工具执行时的上下文类型
│   │   ├── input.ts            # 构造模型的文本 / 图像输入
│   │   ├── history.ts          # 会话历史裁剪与摘要压缩
│   │   ├── control.ts          # 状态、停止、追加用户指示
│   │   ├── queue.ts            # 聊天 / 定时执行双通道
│   │   ├── turn.ts             # 单轮工具调用的执行控制
│   │   ├── workspace-gate.ts   # 共享文件访问互斥
│   │   ├── skills.ts           # 内置与外部 Skill 的发现和加载
│   │   ├── errors.ts           # Agent 错误类型
│   │   └── tools/              # 暴露给模型的工具
│   │       ├── files.ts        # 文件管理
│   │       ├── execution.ts    # 执行 Node.js 代码
│   │       ├── messages.ts     # 发送和操作 Telegram 消息
│   │       ├── questions.ts    # 查询、处理待答事项
│   │       ├── history.ts      # 查询历史消息
│   │       ├── tasks.ts        # 管理定时任务
│   │       ├── settings.ts     # 管理动态配置
│   │       ├── time.ts         # 查询当前时间
│   │       ├── skills.ts       # 读取 Skill 内容
│   │       └── media.ts        # 媒体相关工具
│   │
│   ├── files/                  # 文件操作的实际实现
│   │   ├── workspace.ts        # 授权目录、路径检查、文件操作
│   │   ├── execution.ts        # Docker 中运行 Node.js
│   │   └── archive.ts          # 流式落盘、文件校验
│   │
│   ├── history/                # 持久消息历史
│   │   ├── store.ts            # 主线程调用接口
│   │   ├── worker.ts           # SQLite 存储与检索
│   │   └── policy.ts           # 采集与读取范围
│   │
│   ├── tasks/                  # 定时任务
│   │   ├── store.ts            # 任务计划、执行记录、恢复
│   │   └── scheduler.ts        # 到期检查与执行调度
│   │
│   └── ...plugins              # 各类 Telegram 插件
│
├── skills/                     # 内置操作技能
│   ├── files/SKILL.md
│   ├── markdown/SKILL.md
│   ├── messaging/SKILL.md
│   ├── questions/SKILL.md
│   ├── tasks/SKILL.md
│   ├── execution/SKILL.md
│   ├── settings/SKILL.md
│   └── media/SKILL.md
│
├── tests/                      # 模块测试与集成测试
├── scripts/                    # 运维、迁移和本地 Bot API 脚本
├── docs/                       # 技术文档
├── ecosystem.config.cjs        # PM2 启动配置
├── Dockerfile                  # 构建 Mikan 镜像（最后由于资源问题没有容器化）
├── compose.mikan.yaml          # 容器部署编排
├── package.json
└── tsconfig.json
```

## 下一步计划

现在的 Mikan agent 已经实现了基础的 agent 功能，但是我觉得还不算实用，毕竟还是一个练手的项目。现在用的 OpenAI Agents SDK 的能力要偏编排层一些，上层的 Harness 还需要持续打磨。

我接下来的初步想法是引入更成熟的 Harness 框架，直接使用这种现成的打磨好的框架，目前的候选有：

- **Pi Agent**：比较轻量
- **基于 Cordis 的 DeepSeek Harness**：Cordis很好用，但是之前做 QQ 聊天机器人的时候写了太多了，看看有没有更新鲜的

练手的目标基本达成了，后面的目标是**想办法让它从玩具变成一个真正实用的产品。**
