import React from 'react'
import { motion } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'
import { func, string } from 'prop-types'

import s from '../styles/components/Cover.module.scss'

Cover.propTypes = {
    logo: string,
    slogan: string,
    scrollDown: func,
}

function Cover({ logo, slogan, scrollDown }) {
    return (
        <div className={s.cover}>
            <div className={s.info}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={'logo'} src={logo} />
                <span>{slogan}</span>

            </div>
            <div className={s.down} onClick={scrollDown}>
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 1.0, repeat: Infinity }}>
                    <FaChevronDown size={32} color={'black'} />
                </motion.div>
            </div>
        </div>
    )
}

export default Cover