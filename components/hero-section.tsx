'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlitchText, NeonText } from '@/components/cyberpunk-effects'
import { useTheme } from 'next-themes'

export function HeroSection() {
    const { theme } = useTheme()
    const isCyberpunk = theme === 'cyberpunk'

    // 使用单一背景图片，不再根据主题切换
    const heroImage = 'https://s2.loli.net/2025/08/11/sVJhu6l7fYyBgXC.webp'

    return (
        <section
            className='relative flex flex-col items-center justify-center min-h-screen text-center px-4 top-0'
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // 固定背景位置
            }}>
            {/* 渐变叠加层，提高可读性 */}
            <div className='absolute inset-0 -z-1 bg-gradient-to-b from-background/50 via-background/30 to-transparent' />

            <div className='space-y-6 max-w-3xl z-10'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter truncate'>
                    {isCyberpunk ? (
                        <GlitchText text="TranceDream's Blog" />
                    ) : (
                        <NeonText intensity='high'>TranceDream's Blog</NeonText>
                    )}
                </h1>
                <p className='text-lg sm:text-xl md:text-2xl text-foreground truncate drop-shadow'>
                    After we're gone, the spirit carries on.
                </p>
                <div className='flex justify-center'>
                    <Button
                        variant='outline'
                        size='lg'
                        className={`rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
                            isCyberpunk ? 'border-secondary' : ''
                        }`}
                        onClick={() => {
                            window.scrollTo({
                                top: window.innerHeight,
                                behavior: 'smooth',
                            })
                        }}>
                        浏览文章
                        <ChevronDown className='ml-2 h-4 w-4 animate-pulse' />
                    </Button>
                </div>
            </div>
        </section>
    )
}
