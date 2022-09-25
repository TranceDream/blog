import React from 'react'
import { getBlogConfig } from '../lib/config'
import Layout from '../components/Layout'
import Link from 'next/link'

import s from '../styles/pages/ErrorPage.module.scss'

export const getStaticProps = async () => ({ props: { ...getBlogConfig() } })

function ErrorPage({ background, title }) {
    return (
        <Layout background={background} title={'Oops!~ | ' + title} darken>
            <div className={s.center}>
                <h1>Oops!~ 404 Not Found</h1>
                <div className={s.back}><Link href={'/'} passHref>BACK HOME</Link></div>
            </div>
        </Layout>
    )
}

export default ErrorPage