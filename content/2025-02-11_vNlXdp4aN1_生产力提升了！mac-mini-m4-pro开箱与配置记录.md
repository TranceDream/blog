---
title: 生产力提升了！Mac Mini M4 Pro开箱与配置记录
description: Mac Mini M4 Pro开箱与配置，搭建一个性能强劲的本地工作站。
tags:
  - 开箱
  - macOS
date: '2025-02-11T08:06:25'
cover: 'https://s2.loli.net/2025/02/11/fo5yk6HqMnwvUIs.jpg'
---

## 开箱验货

年后斥巨资购买了一台Mac Mini，以后这个小方盒就作为我的主力机器来使用了@2@。买这玩意儿的背景比较简单，我发现我那用了5年的游戏本似乎已经快到了它的极限，高强度使用下CPU和GPU的性能表现都大不如前，我觉得是我没有换过导热硅脂的原因，前两天在玩自己部署的麦块服务器的时候出现了非常频繁的花屏现象，虽然不能说就是GPU的问题，但是这个RTX2060移动端放在2025年确实也不太能打了@9@。于是一咬牙拿下了这台Mac Mini。

只知道这个机器小，没想到能如此之小。取到快递的时候还以为是送错了，长度和我的G502鼠标差不多。

![开箱](https://s2.loli.net/2025/02/08/xFq7RDoQ1UeLC5Y.png)

![开箱](https://s2.loli.net/2025/02/08/iVlIPc5dhE4OsF1.png)

接口算不上丰富，只能说够用，前后共5个Type-C接口，一个HDMI接口，一个万兆以太网口，还有一个电源口。可惜没有配备USB Type-A接口，我的G502只能插在转接器上用了，键盘也只能用蓝牙模式@1@。

![接口](https://s2.loli.net/2025/02/08/VL3plou6IKJ2ZMb.png)

不过水果的设计还是一流，插好线放在桌面上还是显得比较美观@2@。

![桌面效果](https://s2.loli.net/2025/02/11/9ntXurhfOgv2ywB.png)

令人诟病的一点：这台机器的电源键位置实属刁钻，到货之前我是知道电源键在机器底部的，到货之后是傻眼了，电源是在底部后侧角落@33@。考虑到平时我也很少开关机，这个点就忍一忍吧。

![神秘的电源键位置](https://s2.loli.net/2025/02/08/aYPfiWHUlmzRB8g.png)

## 配置过程

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

当前版本的macOS已经默认装载了Zsh作为默认的Shell，所以这里无需额外安装，可以直接进行配置，我使用Oh My Posh框架来配置我的Zsh。这里使用Oh My Posh的原因主要是Oh My Posh的主题比较美观，而且现在Oh My Posh已经不再局限于Powershell平台，在其他的Shell上也可以方便配置。

```shell
brew install jandedobbeleer/oh-my-posh/oh-my-posh
```

通过Homebrew安装Oh My Posh会安装所有预设的主题，喜欢哪个可以直接在[官网](https://ohmyposh.dev/docs/themes)上预览，或者自己编写主题后通过config参数加载，我就选一个我比较喜欢的`montys`主题。打开`.zshrc`，加入如下内容：

```shell
# 使用 oh-my-posh
if [ "$TERM_PROGRAM" != "Apple_Terminal" ]; then
  eval "$(oh-my-posh init zsh --config $(brew --prefix oh-my-posh)/themes/montys.omp.json)"
fi
```

这里添加判断是为了让ANSI字符渲染有问题的自带终端不使用Oh My Posh的主题。

添加完毕主题之后需要安装一下支持图标的等宽字体，现在比较流行的是Nerd Font系列，使用brew搜索`nerd-font`即可查看支持的字体，我使用的是JetBrains Mono的Nerd Font版本，安装完毕别忘记在iTerm2的Profile设置中更换字体～

```shell
brew install font-jetbrains-mono-nerd-font
```

接下来配置一下插件，插件我使用Antidote进行插件加载，使用Homebrew可以直接安装：

```shell
brew install antidote
```

安装之后，在主目录下添加一个插件列表的文本文件：

```shell
~/.zsh_plugins.txt
```

里面添加要使用的插件声明，如果需要使用Oh My Zsh的插件则需要先加载`getantidote/use-omz`。

```shell
mattmc3/ez-compinit
zsh-users/zsh-completions kind:fpath path:src
zsh-users/zsh-autosuggestions
zdharma-continuum/fast-syntax-highlighting kind:defer
zsh-users/zsh-history-substring-search

# frameworks like oh-my-zsh are supported
getantidote/use-omz        # handle OMZ dependencies
ohmyzsh/ohmyzsh path:lib   # load OMZ's library
ohmyzsh/ohmyzsh path:plugins/colored-man-pages  # load OMZ plugins
ohmyzsh/ohmyzsh path:plugins/sudo
ohmyzsh/ohmyzsh path:plugins/git
ohmyzsh/ohmyzsh path:plugins/node
```

在`.zshrc`中追加下面的内容，启动Antidote并加载插件：

```shell
# 启动 Antidote
source $(brew --prefix)/opt/antidote/share/antidote/antidote.zsh

# 插件列表
antidote load
```

然后重启终端或者`source ~/.zshrc`即可加载插件。配置完成的效果如图，比最初的模样要顺眼许多了@3@。

![iTerm2](https://s2.loli.net/2025/02/10/uYDBEShg5U2wPzd.png)

### 网关配置

终端鼓捣好了之后，就该让这台小苹果为我基地内的设备发光发热了@20@！首先是要搞定本机的魔法上网，咳咳，科学的魔法～这里我使用Mihomo Party，按照说明配置能够上网即可，具体步骤不赘述，懂得都懂喔。用其他的客户端应该也是没有问题的，还请各位自行尝试。

本机能够正常上网后，就可以配置一下这台机器作为网关使用。首先是要弄一个静态的局域网IP，这一步可以在网络设置里完成：

![静态IP](https://s2.loli.net/2025/02/10/wvhzdITbBuUqHJQ.png)

这里要注意指定网络的路由器为自己主路由器的地址，我这里是10.0.0.1。

下一步要打开Mac的IP转发功能，一句话解释IP转发（也就是路由转发）的作用：

> **路由转发（IP 转发）** 是指网络设备（如路由器、服务器）接收来自一个网络接口的数据包，并根据目标 IP 地址将其转发到另一个网络接口，从而实现不同网络之间的数据传输。 —— ChatGPT

听起来有些难懂，总之这个功能就是让当前的设备能转发来自其他设备的请求，起到一个网关的作用。在macOS上开启IP转发直接使用下面这行命令即可：

```shell
sysctl -w net.inet.ip.forwarding=1
```

这样在本次会话中就可以实现IP转发的功能。想要在重启之后也能进行转发操作，那就要把配置固化，写入到/etc/sysctl.conf中，一行脚本搞定：

```shell
[ ! -f /etc/sysctl.conf ] && sudo touch /etc/sysctl.conf; grep -qxF "net.inet.ip.forwarding=1" /etc/sysctl.conf || echo "net.inet.ip.forwarding=1" | sudo tee -a /etc/sysctl.conf
```

IPv4的转发已经弄好了，现在就是让其他的设备通过这台Mac来进行魔法上网@24@。

打开魔法工具的虚拟网卡（TUN），之后在路由器的DHCP设置中将局域网的网关和DNS都指向这台Mac，以TPLink的AX5400路由器设置为例，这里我的Mac局域网地址是10.0.0.10。

![DHCP设置](https://s2.loli.net/2025/02/10/36vu7RpYDJtbLZ1.png)

把手里的其他设备重连一下网络，就能进行简单的魔法上网了@20@～

这里还可以暴露一个局域网的前端控制服务出来，供其他设备去修改魔法设置，比如切换线路等等，这里就不说明啦。

### 软件安装

有了Homebrew这把趁手的兵器，我们就不需要挨个去互联网上下载安装包了，常用的软件都可以通过Homebrew来安装。我列举了一下我会经常使用的一些工具，都能直接通过`brew install xxx`的方式安装下来。

#### 开发工具

性能这么好的机器，平时不写写代码怪可惜的@25@。

- WebStorm：前端开发利器，不要说它臃肿，这东西实在是强大的很啊，现在非商业用途的开发可以免费使用@13@
- Visual Studio Code：功能强大的文本编辑器
- fnm(Fast Node Manager)：nvm的极速版替代品，Written In Rust
- pyenv：Python的版本管理器，挺流行的
- rustup：Rust开发环境配置的最好方式
- OrbStack：Docker Desktop的macOS最佳替代，还能用来跑虚拟机，拿来部署几个docker服务完全没问题

#### 体验工具

- Snipaste：好用的截图工具，本文所有截图均使用该工具截取（，功能挺丰富的，但是我只拿来日常截图使用，体验很不错
- IINA：macOS上做的非常不错的媒体播放器，拿来本地看看媒体文件用
- The Unarchiver：体验比较原生的解压缩工具，但是只有解压功能
- LocalSend：局域网传输文件工具，我已经在基地里每一台设备上都安装了这个@20@
- Typora：WYSIWYG的Markdown书写工具，非常经典，早期版本免费，现在转付费，转付费之后我试过若干工具，最后终于还是又购入了Typora，Typora的体验是要比其他Markdown工具都要好很多
- PicList：图床工具，可以拖拽上传，接入了一些常用图床，我使用比较多还是sm.ms和自建Github图床，配合Typora使用比较丝滑

#### 社交媒体

- QQ微信是要装起来的
- Telegram：推荐macOS原生的Telegram，而非Telegram Desktop

## 有趣玩法

### 本地部署Deepseek R1

我在选购机器的时候特地买了大内存的型号，目的就是为了部署一些模型，平时可以玩玩Deepseek R1和Stable Diffusion。本地部署的好处就是不会受制于服务器资源的限制，毕竟聊到火热的时候突然来上一句“服务器繁忙”还是很烦人的。

首先我们让模型跑起来，我用到Ollama来部署语言模型，在安装Ollama的时候记得使用Cask的包，不要直接安装命令行工具。

```shell
brew install --cask ollama
```

之后在启动台里就可以找到Ollama的图标了，打开输入密码安装命令行工具。使用Ollama拉取想要部署的模型即可，我这里部署一个Deepseek R1:70b：

```shell
ollama run deepseek-r1:70b
```

Ollama会先把模型pull下来，然后再运行。也可以先拉取，之后要运行的时候再run

```shell
ollama pull deepseek-r1:70b
```

对话效果一般般，可以运行但是速度有些慢了。想要比较好的体验可以换成32b的模型，速度会快很多。

![70b](https://s2.loli.net/2025/02/10/YXuseTCSHwc1WM2.png)

接下来让我来给他整一个美观的前端界面。我使用Open Web UI这个项目，通过docker容器的方式部署，用OrbStack来管理：

```shell
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

![OrbStack](https://s2.loli.net/2025/02/10/95CTRbUjok82Vnd.png)

配置好管理员账号之后就能直接用了，Ollama开启的时候能自动检测到本地的模型：

![网页效果](https://s2.loli.net/2025/02/10/r4vWcNuaOREmHCx.png)

太棒了，学到许多！（

![教我煮鸡蛋](https://s2.loli.net/2025/02/10/tZDkxQrHy85VdUC.png)

token生成的速度太慢了，日常使用32b足矣。

![32b的效果](https://s2.loli.net/2025/02/10/I9aUONQzqH61DgE.png)

### 定时任务执行

有这么一台能24小时运行的机器，很多有意思的自动化想法就都能实现了，比如我心心念念的背景音乐自动播放（。如果能在每天晚上下班回家之前开始自动播放，到家之后就可以直接享受音乐了。Mac的服务管理工具launchd正好能实现这个功能，launchd配置起来要比cronjob或日历加Automator门槛高一些，但是效果是最稳定可靠的。

为了设置定时任务，我们得在`~/Library/LaunchAgents`目录下新建一个定时任务配置文件，文件是`plist`类型，命名似乎和一些常见的软件包的命名规则一样，以反域名来命名。比如我这里就建立一个任务`~/Library/LaunchAgents/moe.tranced.bgm.plist`，内容格式如下所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>moe.tranced.bgm</string>
        <key>LimitLoadToSessionType</key>
        <string>Aqua</string>
        <key>ProgramArguments</key>
        <array>
        <string>/Users/tranced/Music/play_bgm.sh</string>
        </array>
        <key>StartCalendarInterval</key>
        <dict>
            <key>Hour</key>
            <integer>22</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
</dict>
</plist>
```

这里要填写好Label；ProgramArguments下面是带有参数的要执行的命令，我这里的脚本目前还没有参数，就先留一行；下面StartCalendarInterval是配置按照时间定时执行，这里我设置了晚上十点，大约正好在我下班进家门之前@3@。编写好了可以通过下面的指令加载和卸载，或者单次start来测试。

```shell
# 加载任务
launchctl load ~/Library/LaunchAgents/moe.tranced.bgm.plist

# 加载之后可以通过start立即执行一次，这里后面接的是定义的Label哦
launchctl start moe.tranced.bgm

# 卸载任务
launchctl unload ~/Library/LaunchAgents/moe.tranced.bgm.plist
```

### 远程桌面VNC

如果有公网IP或者内网穿透服务的话，可以通过这些方法来实现远程桌面连接，在外面也能访问到基地里的机器。这么做之前要先在设置里找到“通用 - 共享 - 屏幕共享”，打开屏幕共享并设置好允许的用户，这里最好勾选“VNC显示程序可以使用密码控制屏幕”。

![屏幕共享设置](https://s2.loli.net/2025/02/11/5VHACPgqOelTXfM.png)

之后就可以通过公网IP或者内网穿透把5900端口暴露出去，实现远程VNC连接～。如果想玩玩高性能模式还需要暴露一下5901端口。

## 最后

写完这个贴的时候机器已经到货配置了三天了，终于把能想到的服务都准备好了，后面就可以当作日常开发和媒体娱乐的主力机了，甚至还能探索一下游戏的能力@25@。

把老游戏本从桌上撤下之后，桌面一下子就整洁了，我的评价是非常满意（。

![终极桌面效果](https://s2.loli.net/2025/02/11/r5LCtTBH1kuzDhb.jpg)

![我的评价是非常满意](https://s2.loli.net/2025/02/11/Ox95Cy6qJ7BuZQv.png)
