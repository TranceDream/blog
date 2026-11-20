export interface FriendLink {
  name: string;
  href: string;
  description?: string;
  avatar?: string;
}

export const ABOUT = {
  bio: [
    '我是 TranceDream，本科毕业于天津大学智能与计算学部软件工程学院，曾就职于某度、某手，meme 收藏家，Pusheen Stickers 收藏家，自部署服务爱好者。手持一台 N5105 NAS 以及一台 Mac Mini，除了这个网站之外，大部分服务都运行在这两个小机器上，自部署真是乐趣无穷呀（不出意外的话）。',
    '本博客随机更新，我会偶尔更新一些技术探索的内容，大部分时间会写一些生活记录和碎碎念，后面有可能写一些 Agentic AI 小文章？',
  ],
  interests: [
    { label: '社畜', retired: false },
    { label: 'NodeJS', retired: false },
    { label: 'Agentic AI', retired: false },
    { label: '前端', retired: true },
    { label: '東方Project', retired: false },
    { label: 'Self-Hosted 爱好者', retired: false },
  ],
  friends: [
    {
      name: 'AstralDex的树洞',
      href: 'https://www.gypsophila.xin/',
      description: '唯有热爱可抵岁月漫长',
      avatar: 'https://s2.loli.net/2025/04/17/kgZF7l2IPbNqcxu.png',
    },
    {
      name: '宇佐见函钩',
      href: 'https://functionhooktju.github.io/FuncBlog/',
      description: '神人东方&舟&母鸡卡 up主，内含计算机学习笔记',
      avatar: 'https://i.postimg.cc/J4PjtCGx/download.jpg',
    },
  ] satisfies FriendLink[],
};
