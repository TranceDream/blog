import React from 'react'
import { bool, node, string } from 'prop-types'
import Layout from './Layout'
import s from '../styles/components/LayoutWithLabel.module.scss'

LayoutWithLabel.propTypes = {
    title: string.isRequired,
    background: string.isRequired,
    darken: bool.isRequired,
    label: string.isRequired,
    children: node,
}

function LayoutWithLabel({ title, background, darken, label, children }) {
    return (
        <Layout background={background} title={title} darken={darken}>
            <div className={s.container}>
                <h1 className={s.label}>{label}</h1>
                {children}
            </div>
        </Layout>
    )
}

export default LayoutWithLabel