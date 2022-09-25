import React from 'react'
import { getBlogConfig } from '../../lib/config'
import LayoutWithLabel from '../../components/LayoutWithLabel'
import TagGroup from '../../components/TagGroup'
import { getTags } from '../../lib/articles'

export async function getStaticProps() {
    const { logo, title, background } = getBlogConfig()
    const tags = getTags()
    return {
        props: {
            logo,
            title,
            background,
            tags,
        },
    }
}

function TagsPage({ title, background, tags }) {
    return (
        <LayoutWithLabel label={'TAGS'} darken background={background} title={'Tags | ' + title}>
            {tags.map(t => (<TagGroup key={t.tag} tag={t.tag} articles={t.articles} />))}
        </LayoutWithLabel>
    )
}

export default TagsPage