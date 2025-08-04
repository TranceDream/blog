'use client'

import type React from 'react'

interface BackgroundProps {
    children: React.ReactNode
}

export function Background({ children }: BackgroundProps) {
    // 使用单一背景图片
    const bgImage = '/background.jpg'

    return (
        <div className='min-h-screen'>
            {/* 固定的背景图层 */}
            <div
                className='fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat'
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundAttachment: 'fixed',
                }}
            />

            {/* 半透明遮罩层 */}
            <div
                className='fixed inset-0 -z-10 bg-background/75 backdrop-blur-sm'
                style={{ backgroundAttachment: 'fixed' }}
            />

            {/* 内容 */}
            <div className='relative z-0 min-h-screen'>{children}</div>
        </div>
    )
}
