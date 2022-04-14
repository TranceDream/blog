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
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const articleData = getArticleData(params.id)
    return {
        props: {
            articleData,
        },
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
        <div
            id={s.container}
            className='w-full overflow-hidden min-h-screen font-["Zilla_Slab","Comfortaa","Noto_Sans_SC",sans-serif]'>
            <Head>
                <title>{articleData.title + " | TranceDream's Blog"}</title>
            </Head>
            <Header sticky={offset + 100 >= innerHeight} />
            <img
                className='fixed top-0 left-0 w-full h-full object-cover z-[1] transition-all ease-in-out duration-500'
                src={articleData.cover}
                alt='cover'
                style={{
                    filter: offset + 100 >= innerHeight ? 'blur(10px)' : '',
                }}
            />
            <img
                className='fixed top-0 left-0 w-full h-full object-cover transition-all ease-in-out duration-500 z-0'
                src={articleData.cover}
                alt='background'></img>
            <section className='w-full h-screen z-[2] relative overflow-hidden flex flex-col items-center justify-center p-24'>
                <h1
                    className='text-white text-7xl text-center font-bold'
                    style={{
                        textShadow: '0 0 10px dimgrey',
                        opacity:
                            1 - offset / innerHeight > 0
                                ? 1 - offset / innerHeight
                                : 0,
                    }}>
                    {articleData.title}
                </h1>
                <div
                    className='text-white text-2xl mt-5'
                    style={{
                        textShadow: '0 0 10px dimgrey',
                        opacity:
                            1 - offset / innerHeight > 0
                                ? 1 - offset / innerHeight
                                : 0,
                    }}>
                    {articleData.date}
                </div>
            </section>
            <section className='bg-white flex flex-col text-xl items-start px-36 py-24 mx-72 mt-2.5 mb-72 z-10 min-h-screen relative transition-all ease-in-out duration-500 hover:drop-shadow-[0_0_20px_lightgray]'>
                <ReactMarkdown
                    className={s.markdown}
                    remarkPlugins={[
                        remarkFrontmatter,
                        remarkMath,
                        remarkGfm,
                        remarkRehype,
                    ]}
                    rehypePlugins={[rehypeKatex, rehypeRaw, rehypePrism]}>
                    {articleData.content}
                </ReactMarkdown>
            </section>
        </div>
    )
}
