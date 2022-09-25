import React, { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { array, string } from 'prop-types'
import TagArticle from './TagArticle'

import s from '../styles/components/TagGroup.module.scss'

TagGroup.propTypes = {
    tag: string.isRequired,
    articles: array.isRequired,
}

function TagGroup({ tag, articles }) {
    const [expanded, expand] = useState(false)
    return (
        <div className={s.container}>
            <div className={s.tag} onClick={_ => expand(!expanded)}>
                <FaChevronRight className={s.icon + (expanded ? ' ' + s.rotate : '')} />
                <span>{tag}</span>
            </div>
            <div className={s.articles}
                 style={{ maxHeight: expanded ? (128 * articles.length + 'px') : 0 }}>
                {articles.map(a => (
                    <TagArticle key={'a-' + a.id} date={a.date} id={a.id} title={a.title} desc={a.desc} />))}
            </div>
        </div>
    )
}

export default TagGroup