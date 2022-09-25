import React, { useState } from 'react'
import Link from 'next/link'
import { string } from 'prop-types'

import s from '../styles/components/Header.module.scss'
import { FaBars } from 'react-icons/fa'

Header.propTypes = {
    logo: string,
}

function Header({ logo }) {
    const [expanded, expand] = useState(false)

    return (
        <header className={s.header}>
            <div className={s.wrapper}>
                <div className={s.icon} onClick={() => {
                    expand(!expanded)
                }}><FaBars /></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Link href={'/'} passHref><img alt={'logo'} src={logo} className={s.logo} /></Link>
            </div>
            <ul className={s.nav + (expanded ? (' ' + s.expanded) : '')}>
                <li className={s.link}><Link href={'/'}>HOME</Link></li>
                <li className={s.link}><Link href={'/archives'}>ARCHIVES</Link></li>
                <li className={s.link}><Link href={'/tags'}>TAGS</Link></li>
                <li className={s.link}><Link href={'/about'}>ABOUT</Link></li>
            </ul>
        </header>
    )
}

export default Header