import React from 'react'
import { getBlogConfig } from '../../lib/config'
import { getSortedArticles } from '../../lib/articles'
import Article from '../../components/Article'
import LayoutWithLabel from '../../components/LayoutWithLabel'

export const getStaticProps = async () => ({ props: { ...getBlogConfig(), articles: getSortedArticles() } })

function ArchivesPage({ background, title, articles }) {
    return (
        <LayoutWithLabel background={background} label={'ARCHIVES'} title={'Archives | ' + title} darken>
            {articles.map(article => (
                <Article key={'a-' + article.id} id={article.id} title={article.title} desc={article.desc}
                         date={article.date} cover={article.cover} tags={article.tags} />))}
        </LayoutWithLabel>
    )
}

export default ArchivesPage