/* eslint-disable @next/next/no-img-element */
import React from 'react'
import s from './photo.module.scss'
import Link from 'next/link'
import dayjs from 'dayjs'

export default function Photo({ className, info: { url, desc, date } }) {
    return (
        <div
            className={
                s.container +
                ' max-h-[60vh] relative overflow-hidden cursor-pointer drop-shadow-[0_0_5px black] transition-all ease-in-out duration-500 hover:drop-shadow-[0_0_20px_black] ' +
                className
            }>
            <Link href={url} passHref>
                <a target={'_blank'}>
                    <img
                        className={'w-full h-full object-cover object-center'}
                        alt={'photo'}
                        src={url}
                    />
                </a>
            </Link>
            <div
                className={
                    s.desc +
                    ' p-4 absolute bottom-0 left-0 right-0 z-100 font-["Zilla_Slab"]'
                }>
                <div
                    className={
                        'self-end mb-2 text-gray-700 tracking-wider font-[Comfortaa]'
                    }>
                    {dayjs(new Date(date)).format('YYYY / MM / DD')}
                </div>
                <div className={'text-black text-xl overflow-ellipsis'}>
                    {desc}
                </div>
            </div>
        </div>
    )
}
