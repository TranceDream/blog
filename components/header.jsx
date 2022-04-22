import React from 'react'
import Link from 'next/link'
import s from './header.module.scss'
import { toast } from 'react-toastify'

export default function Header({ sticky }) {
    const liClass =
        'list-none px-8 py-2.5 ml-2.5 text-xl text-white cursor-pointer select-none font-[Comfortaa] transition-all ease-in-out duration-500 hover:bg-white hover:text-black rounded-full'
    const liShadow = {
        textShadow: '0 0 10px dimgray',
    }
    return (
        <header
            id={sticky ? s.sticky : ''}
            className='fixed top-0 left-0 flex flex-row w-full justify-between items-center px-20 py-10 z-50 box-border transition-all ease-in-out duration-500'>
            <Link passHref href='/'>
                <span
                    className='text-4xl text-white font-extrabold invisible cursor-pointer font-["Zilla Slab"]'
                    id={s.logo}>
                    &lt;/&gt; TranceDream
                </span>
            </Link>
            <ul className='flex flex-row'>
                <Link passHref href='/'>
                    <li className={liClass} style={liShadow}>
                        Home
                    </li>
                </Link>
                <Link passHref href='/articles'>
                    <li className={liClass} style={liShadow}>
                        Articles
                    </li>
                </Link>
                <Link passHref href='/gallery'>
                    <li className={liClass} style={liShadow}>
                        Gallery
                    </li>
                </Link>
                <div
                    onClick={() => {
                        toast.info('WIP', {
                            position: toast.POSITION.TOP_CENTER,
                        })
                    }}>
                    <li className={liClass} style={liShadow}>
                        Friends
                    </li>
                </div>
                <div
                    onClick={() => {
                        toast.info('WIP', {
                            position: toast.POSITION.TOP_CENTER,
                        })
                    }}>
                    <li className={liClass} style={liShadow}>
                        About
                    </li>
                </div>
            </ul>
        </header>
    )
}
