'use client'

import { Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='relative'>
                    <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cyberpunk:scale-0 cyberpunk:-rotate-90' />
                    <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 cyberpunk:scale-0' />
                    <Zap className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all cyberpunk:rotate-0 cyberpunk:scale-100 cyberpunk:text-pink-500' />
                    <span className='sr-only'>切换主题</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className='mr-2 h-4 w-4' />
                    <span>亮色</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className='mr-2 h-4 w-4' />
                    <span>暗色</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('cyberpunk')}>
                    <Zap className='mr-2 h-4 w-4 text-pink-500' />
                    <span>赛博朋克</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
