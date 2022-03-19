/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { getArticleIds, getArticleData } from '../../lib/articles'
import ReactMarkdown from 'react-markdown'
import remarkFrontmatter from 'remark-frontmatter'
import s from '../../styles/ArticleDetail.module.scss'
import Header from '../../components/header'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypePrism from 'rehype-prism-plus'
import Head from 'next/head'

export async function getStaticPaths() {
    const paths = getArticleIds()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const articleData = getArticleData(params.id)
    return {
        props: {
            articleData
        }
    }
}

export default function ArticleDetail({ articleData }) {
    const [offset, setOffset] = useState(0)
    const [innerHeight, setHeight] = useState(0)

    useEffect(() => {
        setHeight(window.innerHeight)
        let onScroll = () => {
            setOffset(window.scrollY)
        }
        let onResize = () => {
            setHeight(window.innerHeight)
        }
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize, { passive: true })
        return function () {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div id={s.container}>
            <Head>
                <title>{articleData.title + ' | TranceDream\'s Blog'}</title>
            </Head>
            <Header sticky={offset + 100 >= innerHeight} />
            <img className={s.coverImage} src={articleData.cover} alt='cover' style={{
                filter: offset + 100 >= innerHeight ? 'blur(10px)' : '',
            }} />
            <img className={s.coverImage} src={articleData.cover} alt='background' style={{ zIndex: 0 }}></img>
            <section id={s.cover}>
                <h1 style={{ opacity: 1 - offset / innerHeight > 0 ? 1 - offset / innerHeight : 0 }}>{articleData.title}</h1>
                <div style={{ opacity: 1 - offset / innerHeight > 0 ? 1 - offset / innerHeight : 0 }} className={s.date}>{articleData.date}</div>
            </section>
            <section className={s.markdown}>
                <ReactMarkdown
                    className={s.markdownContent}
                    remarkPlugins={[
                        remarkFrontmatter,
                        remarkMath,
                        remarkGfm,
                        remarkRehype,
                    ]}
                    rehypePlugins={[
                        rehypeKatex,
                        rehypeRaw,
                        rehypePrism,
                    ]}>{articleData.content}</ReactMarkdown>
            </section>
        </div>
    )
}
