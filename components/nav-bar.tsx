'use client'

import styles from '@/components/nav-bar.module.scss'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const pathname = usePathname()
  const [dark, toggleDark] = useState(false)
  const [collapse, toggleCollapse] = useState(true)

  useEffect(() => {
    const rootPathname = pathname.split('/').slice(1).shift()
    if (rootPathname === '') {
      toggleDark(false)
    } else {
      toggleDark(true)
    }
  }, [pathname])

  return (
    <nav className={`${styles.nav} ${dark ? styles.dark : ''}`}>
      <p className={styles.logo}>
        <span
          className={`${styles.button} ${collapse ? '' : styles.rotate}`}
          onClick={() => {
            toggleCollapse(!collapse)
          }}
        >
          ▷
        </span>
        <span>TranceDream的博客</span>
      </p>
      <ul className={collapse ? styles.hidden : ''}>
        <li
          onClick={() => {
            toggleCollapse(!collapse)
          }}
        >
          <Link href={'/'}>home</Link>
        </li>
        <li
          onClick={() => {
            toggleCollapse(!collapse)
          }}
        >
          <Link href={'/archive'}>archive</Link>
        </li>
        <li
          onClick={() => {
            toggleCollapse(!collapse)
          }}
        >
          <Link href={'/about'}>about</Link>
        </li>
      </ul>
    </nav>
  )
}
