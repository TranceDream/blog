'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            {...props}
            themes={['light', 'dark', 'cyberpunk']} // 添加赛博朋克主题
        >
            {children}
        </NextThemesProvider>
    )
}
