'use client'

import type React from 'react'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
    text: string
    className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
    const { theme } = useTheme()
    const isCyberpunk = theme === 'cyberpunk'

    if (!isCyberpunk) {
        return <span className={className}>{text}</span>
    }

    return (
        <span className={cn('glitch-effect', className)} data-text={text}>
            {text}
        </span>
    )
}

interface NeonTextProps {
    children: React.ReactNode
    className?: string
    intensity?: 'low' | 'medium' | 'high'
}

export function NeonText({
    children,
    className,
    intensity = 'low',
}: NeonTextProps) {
    const { theme } = useTheme()
    const isCyberpunk = theme === 'cyberpunk'

    // 根据强度设置不同的阴影效果
    let neonClass = 'neon-text'
    if (isCyberpunk) {
        if (intensity === 'medium') {
            neonClass = 'neon-text-medium'
        } else if (intensity === 'high') {
            neonClass = 'neon-text-high'
        }
    }

    return (
        <span className={cn(className, isCyberpunk && neonClass)}>
            {children}
        </span>
    )
}

interface NeonBoxProps {
    children: React.ReactNode
    className?: string
    intensity?: 'low' | 'medium' | 'high'
}

export function NeonBox({
    children,
    className,
    intensity = 'low',
}: NeonBoxProps) {
    const { theme } = useTheme()
    const isCyberpunk = theme === 'cyberpunk'

    // 根据强度设置不同的阴影效果
    let neonClass = 'neon-border'
    if (isCyberpunk) {
        if (intensity === 'medium') {
            neonClass = 'neon-border-medium'
        } else if (intensity === 'high') {
            neonClass = 'neon-border-high'
        }
    }

    return (
        <div className={cn(className, isCyberpunk && neonClass)}>
            {children}
        </div>
    )
}
