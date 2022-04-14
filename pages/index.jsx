import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Article from '../components/article'
import { getRecentArticles } from '../lib/articles'
import Header from '../components/header'
import { getLatestPhoto } from '../lib/gallery'
import Photo from '../components/photo'
import Link from 'next/link'

export async function getStaticProps() {
    const allArticles = getRecentArticles()
    const photo = getLatestPhoto()
    return {
        props: {
            allArticles,
            photo,
        },
    }
}

export default function Home({ allArticles, photo }) {
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
        <div className='font-["Zilla_Slab"]'>
            <Head>
                <title>TranceDream&apos;s Blog</title>
            </Head>
            <Header sticky={sticky} />
            <section className='sticky top-0 min-h-screen flex flex-row justify-evenly overflow-hidden text-white items-center'>
                <div className='w-full h-screen absolute bg-black opacity-50 -z-[1] select-none'></div>
                <div className='absolute -z-10 w-full h-screen select-none'>
                    <Image
                        src='/2.png'
                        alt='background'
                        layout='fill'
                        objectFit='cover'
                        objectPosition='top'
                    />
                </div>
                <div>
                    <h1 className='text-8xl font-bold whitespace-nowrap select-none'>
                        &lt;/&gt; TranceDream
                    </h1>
                    <div className='text-4xl mt-12 whitespace-nowrap select-none'>
                        Let&apos;s believe. Destiny is right here by your side.
                    </div>
                </div>
                <div
                    className='px-16 py-3 ml-16 text-3xl font-["Comfortaa"] bg-white text-black rounded-full select-none cursor-pointer'
                    onClick={() => {
                        window.scroll({
                            top: window.innerHeight,
                            behavior: 'smooth',
                        })
                    }}>
                    Explore
                </div>
            </section>
            <section
                className='sticky top-0 min-h-screen flex text-white flex-col bg-[url(/diagonal-squares.png)] px-72 py-36'
                style={{ backgroundPositionX: offset * 0.25 + 'px' }}>
                <Link passHref href={'/articles'}>
                    <h2 className='text-6xl cursor-pointer select-none mb-16 self-start font-["Comfortaa"]'>
                        Recent Articles
                    </h2>
                </Link>
                <div className={'flex flex-col gap-16'}>
                    {allArticles.map(
                        ({ id, date, title, desc, tags, cover }) => (
                            <Article
                                key={id}
                                id={id}
                                date={date}
                                title={title}
                                desc={desc}
                                tags={tags}
                                cover={cover}></Article>
                        )
                    )}
                </div>
                <Link passHref href={'/gallery'}>
                    <h2 className='text-6xl cursor-pointer select-none my-16 self-start font-["Comfortaa"]'>
                        Gallery
                    </h2>
                </Link>
                <Photo info={photo} />
            </section>
        </div>
    )
}
