export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'twitter' | 'email' | 'rss' | 'link';
}

export const SITE = {
  url: 'https://trancedre.am',
  title: 'TranceDream’s Blog',
  description: 'TranceDream’s Blog',
  author: 'TranceDream',
  locale: 'zh-CN',
  timeZone: 'Asia/Shanghai',
  archivePageSize: 10,
  profile: {
    // public/ 下的本地图片路径；设为 '' 可隐藏头像。
    avatar: '/avatar.webp',
    avatarAlt: 'TranceDream 的头像',
    greeting: '( ´･_･`)旦',
    bio: [
      '这里是 TranceDream 的博客，我会在这里更新一些：技术探索、踩坑记录、生活日常，以及杂七杂八的内容，佛系记录，随缘更新~',
    ],
  },
  // 删除条目或留空 href 即可隐藏；其他平台可使用 link 图标。
  socials: [
    { label: 'GitHub', href: 'https://github.com/TranceDream', icon: 'github' },
    { label: 'Twitter / X', href: 'https://x.com/kaqsice', icon: 'twitter' },
    { label: 'Email', href: 'mailto:xgxxge@gmail.com', icon: 'email' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ] satisfies SocialLink[],
  features: {
    labs: true,
  },
  // 按需配置角色名与头像路径；角色对话插件仍然保留。
  characters: { 菲比: '/phoebe.webp' } satisfies Record<string, string>,
} as const;
