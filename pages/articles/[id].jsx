/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { getArticleData, getArticleIds } from '../../lib/articles'
import ReactMarkdown from 'react-markdown'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypePrism from 'rehype-prism-plus'
import { getBlogConfig } from '../../lib/config'
import dayjs from 'dayjs'
import Link from 'next/link'
import Layout from '../../components/Layout'

import s from '../../styles/pages/ArticlePage.module.scss'

export const getStaticProps = async ({ params }) => ({
    props: {
        ...getBlogConfig(),
        article: getArticleData(params.id),
    },
})

export async function getStaticPaths() {
    const paths = getArticleIds()
    return {
        paths,
        fallback: false,
    }
}

export default function ArticlePage({ title, article }) {
    let onScroll = () => {
        setDarken(window.scrollY >= window.innerHeight)
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
        <Layout background={article.cover} title={article.title + ' | ' + title} darken={darken}>
            <div className={s.cover}>
                <h1 className={s.title}>{article.title}</h1>
                <span className={s.date}>{dayjs(article.date).format('YYYY[年]MM[月]DD[日]')}</span>
                <div className={s.tags}>
                    {article.tags.map(t => <Link key={t} href={'/tags'} passHref><span
                        className={s.tag}>{t}</span></Link>)}
                </div>
            </div>
            <div className={s.content}>
                <article className={s.article}>
                    <ReactMarkdown
                        className={s.markdown}
                        remarkPlugins={[
                            remarkFrontmatter,
                            remarkMath,
                            remarkGfm,
                            remarkRehype,
                        ]}
                        rehypePlugins={[rehypeKatex, rehypeRaw, rehypePrism]}>
                        {article.content}
                    </ReactMarkdown>
                </article>
            </div>
        </Layout>
    )
}
