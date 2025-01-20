import styles from '@/app/blog/[slug]/page.module.scss'
import { getAllPosts, getPostData } from '@/utils/markdown'
import dayjs from 'dayjs'
import { Metadata } from 'next'

import type { Frontmatter, Article } from '@/types/article'

interface BlogPageParams {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts: Frontmatter[] = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPageParams): Promise<Metadata> {
  const { slug } = await params
  const article: Article = await getPostData(decodeURIComponent(slug))

  return {
    title: `${article.title} | TranceDream的博客`,
    description: article.description,
  }
}

export default async function BlogPage({ params }: BlogPageParams) {
  const { slug } = await params
  const article: Article = await getPostData(decodeURIComponent(slug))

  return (
    <main className={styles.main}>
      <section
        className={styles.header}
        style={{
          background: article.cover
            ? `url('${article.cover}')`
            : `url('/placeholder.jpg')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1>{article.title}</h1>
        <p className={styles.date}>
          {dayjs(article.date).format('YYYY-MM-DD')}
        </p>
        <p className={styles.tags}>
          {article.tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        <p>{article.description}</p>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  )
}
