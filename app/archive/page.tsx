import styles from '@/app/archive/page.module.scss'
import ArticleEntry from '@/components/article-entry'
import { getAllPosts } from '@/utils/markdown'
import BackgroundWrapper from '@/components/background-wrapper'

export default function ArchivePage() {
  const posts = getAllPosts()

  return (
    <BackgroundWrapper backgroundImage={'/background.jpg'}>
      <main className={styles.main}>
        <h1>Archive</h1>
        <ul>
          {posts.map(article => (
            <ArticleEntry key={article.slug} article={article} />
          ))}
        </ul>
      </main>
    </BackgroundWrapper>
  )
}
