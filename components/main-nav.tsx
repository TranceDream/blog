'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { GlitchText, NeonText } from '@/components/cyberpunk-effects'
import { useIsMobile } from '@/hooks/use-mobile'
import { ModeToggle } from '@/components/mode-toggle'

export function MainNav() {
    const isMobile = useIsMobile()

    const navItems = [
        { href: '/', label: '首页' },
        { href: '/archive', label: '归档' },
        { href: '/about', label: '关于' },
    ]

    const NavLinks = () => (
        <nav className='flex gap-6'>
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className='flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
                    {item.label}
                </Link>
            ))}
        </nav>
    )

    return (
        <div className='flex gap-6 md:gap-10 items-center justify-between w-full'>
            {isMobile ? (
                <>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant='outline' size='icon'>
                                <Menu className='h-4 w-4' />
                                <span className='sr-only'>Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side='right'
                            className='w-[240px] sm:w-[280px]'>
                            <div className='flex flex-col gap-4 mt-6'>
                                {navItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className='flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link href='/' className='flex-1 flex justify-center'>
                        <span className='inline-block font-bold'>
                            <NeonText>
                                <GlitchText text="TranceDream's Blog" />
                            </NeonText>
                        </span>
                    </Link>
                    <ModeToggle />
                </>
            ) : (
                <>
                    <Link href='/' className='flex items-center space-x-2'>
                        <span className='inline-block font-bold'>
                            <NeonText>
                                <GlitchText text="TranceDream's Blog" />
                            </NeonText>
                        </span>
                    </Link>
                    <NavLinks />
                    <div className='flex-1' />
                    <ModeToggle />
                </>
            )}
        </div>
    )
}
