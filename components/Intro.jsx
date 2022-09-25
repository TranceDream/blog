import React from 'react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypePrism from 'rehype-prism-plus'
import ReactMarkdown from 'react-markdown'
import { any, string } from 'prop-types'
import copy from 'copy-to-clipboard'
import { FaGithub, FaTelegram, FaWeixin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'
import { toast } from 'react-toastify'

import s from '../styles/components/Intro.module.scss'

Intro.propTypes = {
    name: string.isRequired,
    avatar: string.isRequired,
    social: any.isRequired,
    introduction: string.isRequired,
}

function Intro({ name, avatar, social, introduction }) {
    return (
        <div className={s.card}>
            <div className={s.info}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.avatar} alt={'avatar'} src={avatar} />
                <span className={s.name}>{name}</span>
                <div className={s.social}>
                    {(social.github && social.github !== '') &&
                        <Link href={social.github} passHref><FaGithub title={'Github'} size={24}
                                                                      color={'gray'} /></Link>}
                    {(social.email && social.email !== '') &&
                        <Link href={'mailto:' + social.email} passHref><MdEmail title={'Email'} size={24}
                                                                                color={'gray'} /></Link>}
                    {(social.wechat && social.wechat !== '') && <span onClick={() => {
                        copy(social.wechat)
                        toast('WeChat Copied')
                    }
                    }><FaWeixin title={'WeChat'} size={24}
                                color={'gray'} /></span>}
                    {(social.telegram && social.telegram !== '') &&
                        <Link href={social.telegram} passHref><FaTelegram title={'Telegram'} size={24}
                                                                          color={'gray'} /></Link>}
                </div>
            </div>
            <div className={s.content}>
                <ReactMarkdown
                    className={s.markdown}
                    remarkPlugins={[
                        remarkFrontmatter,
                        remarkMath,
                        remarkGfm,
                        remarkRehype,
                    ]}
                    rehypePlugins={[rehypeKatex, rehypeRaw, rehypePrism]}>
                    {introduction}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default Intro