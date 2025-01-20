import styles from '@/app/archive/page.module.scss'
import ArticleEntry from '@/components/article-entry'
import { getAllPosts } from '@/utils/markdown'

export default function ArchivePage() {
  const posts = getAllPosts()

  return (
    <main className={styles.main}>
      <h1>Archive</h1>
      <ul>
        {posts.map(article => (
          <ArticleEntry key={article.slug} article={article} />
        ))}
      </ul>
    </main>
  )
}
