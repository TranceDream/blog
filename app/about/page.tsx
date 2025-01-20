import styles from '@/app/about/page.module.scss'
import Link from 'next/link'

import { FaAt, FaGithub, FaTelegram } from 'react-icons/fa6'

import avatar from '@/public/avatar.png'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <p className={styles.copyright}>Photo by Tim Marshall on Unsplash</p>
      <div className={styles.profile}>
        <Image className={styles.avatar} src={avatar} alt='头像' />
        <h1 className={styles.name}>TranceDream</h1>
        <div className={styles.social}>
          <Link
            href='mailto:xgxxge@gmail.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaAt />
          </Link>
          <Link
            href='https://github.com/TranceDream'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </Link>
          <Link
            href='https://t.me/TranceDream'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTelegram />
          </Link>
        </div>
        <p className={styles.bio}>
          <span>社畜｜NodeJS｜前端｜策略算法</span>
          <sup>PS: 均为菜鸟水平</sup>
          <span>电子音乐 & 单机游戏</span>
        </p>
      </div>
      <div className={styles.about}>
        <h1>关于TranceDream的博客</h1>
        <br></br>
        <p>
          这里存放我记录的md文档，平时会在这里写一些没用的东西，也会记录一下技术上遇到的问题和解决方案，至于技术文章的话，目前我还没有什么思路，想到了再去写吧。
        </p>
      </div>
    </main>
  )
}
