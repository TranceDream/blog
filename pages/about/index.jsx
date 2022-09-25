import React from 'react'
import LayoutWithLabel from '../../components/LayoutWithLabel'
import { getBlogConfig, getIntroConfig } from '../../lib/config'
import Intro from '../../components/Intro'

export async function getStaticProps() {
    const { logo, title, background } = getBlogConfig()
    return {
        props: {
            logo,
            title,
            background,
            ...getIntroConfig(),
        },
    }
}

function AboutPage({ logo, title, background, ...intro }) {
    return (
        <LayoutWithLabel background={background} label={'ABOUT ME'} title={'About | ' + title} darken>
            <Intro name={intro.name} avatar={intro.avatar} introduction={intro.introduction} social={intro.social} />
        </LayoutWithLabel>
    )
}

export default AboutPage