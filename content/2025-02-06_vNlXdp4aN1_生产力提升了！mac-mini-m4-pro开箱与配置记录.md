---
title: "生产力提升了！Mac Mini M4 Pro开箱与配置记录"
description: "Mac Mini M4 Pro开箱与配置，搭建一个性能强劲的本地工作站。"
tags: ["开箱", "macOS"]
date: "2025-02-06T15:10:46"
cover: "todo"
---

## 开箱

年后斥巨资购买了一台Mac Mini，以后这个小方盒就作为我的主力机器来使用了@2@。买这玩意儿的背景比较简单，我发现我那用了5年的游戏本似乎已经快到了它的极限，高强度使用下CPU和GPU的性能表现都大不如前，我觉得是我没有换过导热硅脂的原因，前两天在玩自己部署的麦块服务器的时候出现了非常频繁的花屏现象，虽然不能说就是GPU的问题，但是这个RTX2060移动端放在2025年确实也不太能打了@9@。于是一咬牙拿下了这台Mac Mini。

只知道这个机器小，没想到能如此之小。取到快递的时候还以为是送错了，长度和我的G502鼠标差不多。

【图片】
【图片】

接口算不上丰富，只能说够用，前后共5个Type-C接口，一个HDMI接口，一个万兆以太网口，还有一个电源口。可惜没有配备USB Type-A接口，我的G502只能插在转接器上用了，键盘也只能用蓝牙模式@1@。

【图片】

不过水果的设计还是一流，插好线放在桌面上还是显得比较美观@2@。

【图片】

令人诟病的一点：这台机器的电源键位置实属刁钻，到货之前我是知道电源键在机器底部的，到货之后是傻眼了，电源是在底部后侧角落@33@。考虑到平时我也很少开关机，这个点就忍一忍吧。

## 配置

一切都准备好之后，就要开始把它调教一番啦@25@。

我的基地目前在工作的桌面端设备有两个，一台是服役5年多的暗影精灵5，另一台就是搭载了宇宙万物的N5095小服务器@3@。暗影精灵5其实日常使用还是没什么问题，不过我总觉得一直让它这么高负荷运转下去是不妥的，后面可能要玩一些大型游戏或者执行强依赖Windows的任务再把它请出来吧，游戏本24小时开机功耗也成问题。N5095小服务器运行还算比较稳定，但是我决定将它的职责分一大部分出去，不这么做的话迟早会从 All in One 变成 All in Boom。

所以我对这台Mac Mini的定位就是，取代老游戏本的位置，并且还要分担一部分服务器的工作，M4Pro处理这些肯定是要比i7-9750H和N5095加起来要强的@2@。

接下来就开始配置一下这台高性能小方块。

### 经典的macOS软件包管理器 - Homebrew

@1@果然说起macOS的包管理器，Homebrew总是出现在Mac用户脑海里的第一个选项，虽然缺点也不少，比如速度慢、各种啤酒术语让人眼花缭乱，但是不得不说，Homebrew算是社区规模最大、最流行的macOS包管理器。

首先在自带的终端里执行下Command Line Tool for Xcode的安装，CLT会提供一些基础的工具，例如make。

```shell
xcode-select --install
```

装好之后开始安装Homebrew，这里我使用清华源来配置：

```shell
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_INSTALL_FROM_API=1
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_PIP_INDEX_URL="https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple"

# 从镜像下载安装脚本并安装 Homebrew / Linuxbrew
git clone --depth=1 https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/install.git brew-install
/bin/bash brew-install/install.sh
rm -rf brew-install
```

安装完成之后，根据最后的提示写入对应的环境变量即可～使用`brew help`来测试是否安装成功。

Homebrew拿下之后就可以立即把iTerm2装起来了，后面就可以告别这个简陋的小终端了@28@。

```shell
brew install --cask iterm2
```


### Z Shell配置 - Oh My Zsh

使用官网提供的脚本可以一键安装，方便快捷。

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
