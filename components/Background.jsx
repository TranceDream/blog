import React from 'react'
import { bool, string } from 'prop-types'

import s from '../styles/components/Background.module.scss'

Background.propTypes = {
    background: string,
    darken: bool,
}

function Background({ background, darken }) {
    return (
        <div className={s.background} style={{ backgroundImage: `url(${background})` }}>
            <div className={s.opaque + (darken ? (' ' + s.darken) : '')} />
        </div>
    )
}

export default Background