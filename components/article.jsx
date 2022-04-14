/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import s from './article.module.scss'

export default function Article({ id, date, title, desc, tags, cover }) {
    return (
        <Link href={`/articles/${id}`} passHref>
            <div className='flex flex-row bg-white w-full h-80 cursor-pointer drop-shadow-[0_0_5px black] transition-all ease-in-out duration-500 hover:drop-shadow-[0_0_20px_black]'>
                <img
                    className='w-[400px] min-w-[400px] object-cover transition-all ease-in-out duration-500 hover:origin-center hover:scale-125'
                    src={cover}
                    alt='cover'></img>
                <div
                    id={s.content}
                    className='text-black flex flex-col justify-between overflow-hidden relative px-[5%] py-[2.5%] w-full'>
                    <div>
                        <div
                            id={s.title}
                            className='text-4xl font-bold overflow-hidden border-l-8 border-l-slate-500 pl-2 transition-all ease-in-out duration-500'>
                            {title}
                        </div>
                        <div className='flex flex-row whitespace-nowrap mt-4'>
                            {tags.map((tag) => {
                                return (
                                    <a
                                        className='no-underline text-gray-500 visited:text-gray-500 '
                                        key={`${id}-${tag}`}
                                        href='#'>
                                        #{tag}
                                    </a>
                                )
                            })}
                        </div>
                        <div
                            className={`${s.desc} text-xl mt-2.5 overflow-hidden`}>
                            {desc}
                        </div>
                    </div>
                    <div
                        className={
                            'self-end text-gray-500 tracking-wider font-[Comfortaa]'
                        }>
                        {date}
                    </div>
                </div>
            </div>
        </Link>
    )
}
