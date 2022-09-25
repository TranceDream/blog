import React from 'react'
import { string } from 'prop-types'
import dayjs from 'dayjs'
import Link from 'next/link'

import s from '../styles/components/TagArticle.module.scss'

TagArticle.propTypes = {
    id: string.isRequired,
    title: string.isRequired,
    desc: string.isRequired,
    date: string.isRequired,
}

function TagArticle({ id, title, desc, date }) {
    return (
        <Link href={`/articles/${id}`} passHref>
            <div className={s.container}>
                <div>
                    <h2 className={s.title}>{title}</h2>
                    <span className={s.date}>{dayjs(date).format('YYYY[年]MM[月]DD[日]')}</span>
                </div>
                <span className={s.desc}>{desc}</span>
            </div>
        </Link>
    )
}

export default TagArticle