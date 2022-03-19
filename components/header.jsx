import React from 'react'
import Link from 'next/link'
import s from './header.module.scss'
import { toast } from 'react-toastify'

export default function Header({ sticky }) {
    return (
        <header id={sticky ? s.sticky : ''} className={s.header}>
            <Link passHref href='/'><span id={s.logo}>&lt;/&gt; TranceDream</span></Link>
            <ul>
                <Link passHref href='/'><li>Home</li></Link>
                <Link passHref href='/articles'><li>Articles</li></Link>
                <div onClick={() => { toast.info('WIP', { position: toast.POSITION.TOP_CENTER }) }}><li>Moments</li></div>
                <div onClick={() => { toast.info('WIP', { position: toast.POSITION.TOP_CENTER }) }}><li>Friends</li></div>
                <div onClick={() => { toast.info('WIP', { position: toast.POSITION.TOP_CENTER }) }}><li>About</li></div>
            </ul>
        </header>
    )
}
