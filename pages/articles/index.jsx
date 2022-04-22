import React, { useState, useEffect } from 'react'
import Header from '../../components/header'
import { getSortedArticles } from '../../lib/articles'
import Article from '../../components/article'
import Head from 'next/head'

export async function getStaticProps() {
    const allArticles = getSortedArticles()
    return {
        props: {
            allArticles,
        },
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
        <div>
            <Head>
                <title>All Articles | TranceDream&apos;s Blog</title>
            </Head>
            <Header sticky />
            <section
                className='min-h-screen flex flex-col items-center px-72 py-36 bg-[url(/diagonal-squares.png)]'
                style={{ backgroundPositionX: offset * 0.25 + 'px' }}>
                <h2 className='text-white self-start text-6xl mb-16'>
                    All Articles
                </h2>
                <div className={'flex flex-col gap-16'}>
                    {allArticles.map((article) => (
                        <Article
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            date={article.date}
                            desc={article.desc}
                            tags={article.tags}
                            cover={article.cover}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
