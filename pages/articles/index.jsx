import React, { useState, useEffect } from 'react'
import Header from '../../components/header'
import s from '../../styles/ArticleList.module.scss'
import { getSortedArticles } from '../../lib/articles'
import Article from '../../components/article'
import Head from 'next/head'

export async function getStaticProps() {
  const allArticles = getSortedArticles()
  return {
    props: {
      allArticles
    }
  }
}

export default function ArticleList({ allArticles }) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    let onScroll = () => {
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
        <title>All Articles | TranceDream&apos;s Blog</title>
      </Head>
      <Header sticky />
      <section style={{ backgroundPositionX: offset * 0.25 + 'px' }}>
        <h2>All Articles</h2>
        {allArticles.map(article => (<Article
          key={article.id}
          id={article.id}
          title={article.title}
          date={article.date}
          desc={article.desc}
          tags={article.tags}
          cover={article.cover} />))}
      </section>
    </div>
  )
}
