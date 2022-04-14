import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../../components/header'
import Photo from '../../components/photo'
import { getGalleryData } from '../../lib/gallery'

export async function getStaticProps() {
    const data = getGalleryData() ?? []
    return {
        props: {
            data,
        },
    }
}

export default function Gallery({ data }) {
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
                <title>Gallery | TranceDream&apos;s Blog</title>
            </Head>
            <Header sticky />
            <section
                className='min-h-screen flex flex-col items-center px-72 py-36 bg-[url(/diagonal-squares.png)]'
                style={{ backgroundPositionX: offset * 0.25 + 'px' }}>
                <h2 className='text-white self-start text-6xl mb-16 font-[Comfortaa]'>
                    Gallery
                </h2>
                <div className='w-full grid grid-cols-2 gap-12'>
                    {data.map((photo, index) => {
                        if (index === 0) {
                            return (
                                <Photo
                                    key={photo.time + index}
                                    className={'col-span-2'}
                                    info={photo}
                                />
                            )
                        } else {
                            if (
                                data.length % 2 === 0 &&
                                index === data.length - 1
                            ) {
                                return (
                                    <Photo
                                        key={photo.time + index}
                                        className={'col-span-2'}
                                        info={photo}
                                    />
                                )
                            } else {
                                return (
                                    <Photo
                                        key={photo.time + index}
                                        info={photo}
                                    />
                                )
                            }
                        }
                    })}
                </div>
            </section>
        </div>
    )
}
