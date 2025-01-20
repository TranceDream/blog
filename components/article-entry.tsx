import styles from '@/components/article-entry.module.scss'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import placeholder from '@/public/placeholder.jpg'
import type { Frontmatter } from '@/types/article'

interface Params {
  article: Frontmatter
}

export default function ArticleEntry({ article }: Params) {
  return (
    <div className={styles.entry}>
      <div className={styles.cover}>
        <Image
          loading='lazy'
          src={article.cover ? decodeURIComponent(article.cover) : placeholder}
          alt={article.title}
          style={{
            objectFit: 'cover',
          }}
          fill
        />
      </div>
      <Link href={`/blog/${article.slug}`}>
        <h2>{article.title}</h2>
        <p className={styles.date}>
          {dayjs(article.date).format('YYYY-MM-DD')}
        </p>
        <p className={styles.description}>{article.description}</p>
      </Link>
    </div>
  )
}
