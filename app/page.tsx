import styles from '@/app/page.module.scss'
import BackgroundWrapper from '@/components/background-wrapper'

export default function HomePage() {
  return (
    <BackgroundWrapper backgroundImage={'/background.jpg'}>
      <main className={styles.main}>
        <section className={styles.header}>
          <h1>TranceDream的博客</h1>
          <p>After we're gone, the spirit carries on.</p>
        </section>
      </main>
    </BackgroundWrapper>
  )
}
