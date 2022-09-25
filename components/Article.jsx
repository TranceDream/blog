/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import dayjs from 'dayjs'
import s from '../styles/components/Article.module.scss'

export default function Article({ id, date, title, desc, tags, cover }) {
    return (
        <div className={s.card}>
            <img className={s.cover} alt={'cover'} src={cover} />
            <div className={s.info}>
                <Link href={`/articles/${id}`} passHref>
                    <h2 className={s.title}>{title}</h2>
                </Link>
                <div className={s.tags}>
                    {tags.map(t => <Link key={t} href={'/tags'} passHref><span className={s.tag}>{t}</span></Link>)}
                </div>
                <Link href={`/articles/${id}`} passHref>
                    <p className={s.desc}>{desc}</p>
                </Link>
                <span className={s.date}>{dayjs(date).format('YYYY[年]MM[月]DD[日]')}</span>
            </div>
        </div>
    )
}
