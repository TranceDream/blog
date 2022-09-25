import React, { useEffect, useState } from 'react'
import { getRecentArticles } from '../lib/articles'
import { getBlogConfig, getIntroConfig } from '../lib/config'
import Cover from '../components/Cover'
import Article from '../components/Article'
import Link from 'next/link'
import Intro from '../components/Intro'
import Layout from '../components/Layout'

import s from '../styles/pages/HomePage.module.scss'

export async function getStaticProps() {
    const { logo, background, title, slogan } = getBlogConfig()
    const articles = getRecentArticles(3)
    const intro = getIntroConfig()
    return {
        props: {
            logo,
            background,
            title,
            slogan,
            articles,
            ...intro,
        },
    }
}

export default function HomePage({ logo, background, title, slogan, articles, ...intro }) {
    let onScroll = () => {
        setDarken(window.scrollY >= window.innerHeight)
    }
    let scrollDown = () => {
        window.scrollTo(0, window.innerHeight)
    }

    const [darken, setDarken] = useState(false)
    useEffect(() => {
        onScroll()
        removeEventListener('scroll', onScroll)
        addEventListener('scroll', onScroll, { passive: true })
        return () => {
            removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <Layout background={background} title={title} darken={darken}>
            <Cover logo={logo} slogan={slogan} scrollDown={scrollDown} />
            <div className={s.content}>
                <h2 className={s.label}>
                    ABOUT ME
                </h2>
                <Intro name={intro.name} avatar={intro.avatar} social={intro.social}
                       introduction={intro.introduction} />
                <h2 className={s.label}>
                    RECENT ARTICLES
                </h2>
                <div className={s.articles}>
                    {articles.map(a => <Article key={'h-' + a.id} id={a.id} title={a.title} desc={a.desc}
                                                date={a.date} cover={a.cover}
                                                tags={a.tags} />)}
                    <div className={s.more}><Link href={'/archives'} passHref>MORE ARTICLES</Link></div>
                </div>
            </div>
        </Layout>
    )
}
