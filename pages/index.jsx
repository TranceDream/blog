/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Article from '../components/article'
import s from '../styles/Home.module.scss'
import { getRecentArticles } from '../lib/articles'
import Header from '../components/header'

export async function getStaticProps() {
  const allArticles = getRecentArticles()
  return {
    props: {
      allArticles
    }
  }
}

export default function Home({ allArticles }) {
  const [sticky, toggleSticky] = useState(false)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    let onScroll = () => {
      toggleSticky(window.scrollY >= window.innerHeight)
      setOffset(window.scrollY)
    }
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <div id={s.container}>
      <Head>
        <title>TranceDream&apos;s Blog</title>
      </Head>
      <Header sticky={sticky} />
      <section id={s.cover}>
        <div id={s.pane}></div>
        <div id={s.img}>
          <Image
            src='/2.png'
            alt='background'
            layout='fill'
            objectFit='cover'
            objectPosition='top' />

        </div>
        <div id={s.info}>
          <h1 id={s.name}>&lt;/&gt; TranceDream</h1>
          <div id={s.bio}>Let&apos;s believe. Destiny is right here by your side.</div>
        </div>
        <div id={s.explore} onClick={() => {
          window.scroll({
            top: window.innerHeight,
            behavior: 'smooth'
          })
        }}>Explore</div>
      </section>
      <section id='content' style={{ backgroundPositionX: offset * 0.25 + 'px' }}>
        <h2>Recent Articles</h2>
        {allArticles.map(({ id, date, title, desc, tags, cover }) => (
          <Article key={id} id={id} date={date} title={title} desc={desc} tags={tags} cover={cover}></Article>
        ))}
      </section>
    </div>
  )
}
