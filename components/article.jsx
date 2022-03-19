/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import s from './article.module.scss'

export default function Article({ id, date, title, desc, tags, cover }) {
  return (
    <Link href={`/articles/${id}`} passHref>
      <div className={s.card}>
        <img className={s.cover} src={cover} alt='cover'></img>
        <div className={s.content}>
          <div>
            <div className={s.title}>{title}</div>
            <div className={s.tags}>
              {tags.map(tag => {
                return (<a key={`${id}-${tag}`} href='#'>
                  #{tag}
                </a>)
              })}
            </div>
            <div className={s.desc}>{desc}</div>
          </div>
          <div className={s.time}>{date}</div>
        </div>
      </div>
    </Link>
  )
}
