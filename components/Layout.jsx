import React, { Fragment } from 'react'
import Head from 'next/head'
import Background from './Background'
import { bool, node, string } from 'prop-types'

import s from '../styles/components/Layout.module.scss'

Layout.propTypes = {
    title: string.isRequired,
    background: string.isRequired,
    darken: bool.isRequired,
    children: node,
}

function Layout({ title, background, darken, children }) {
    return (
        <Fragment>
            <Head>
                <title>{title}</title>
            </Head>
            <Background background={background} darken={darken} />
            <main className={s.main}>
                {children}
            </main>
        </Fragment>
    )
}

export default Layout