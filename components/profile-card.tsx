'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NeonBox } from '@/components/cyberpunk-effects'
import { useTheme } from 'next-themes'
import { Github, Mail, MessageSquare, Send } from 'lucide-react'

export interface ProfileData {
    avatar: string
    name: string
    bio: string
    contacts: {
        github?: string
        email?: string
        telegram?: string
    }
}

interface ProfileCardProps {
    profile: ProfileData
}

export function ProfileCard({ profile }: ProfileCardProps) {
    const { theme } = useTheme()
    const isCyberpunk = theme === 'cyberpunk'

    return (
        <NeonBox className='w-full'>
            <Card
                className={`overflow-hidden ${
                    isCyberpunk ? 'border-secondary/50' : ''
                }`}>
                <CardContent className='p-6'>
                    <div className='flex flex-col md:flex-row items-center gap-6'>
                        {/* 头像 */}
                        <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg'>
                            <Image
                                src={profile.avatar || '/placeholder.webp'}
                                alt={profile.name}
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>

                        {/* 个人信息 */}
                        <div className='flex flex-col items-center md:items-start space-y-4'>
                            <div className='text-center md:text-left'>
                                <h2 className='text-2xl font-bold'>
                                    {profile.name}
                                </h2>
                                <p className='mt-2 text-muted-foreground'>
                                    {profile.bio}
                                </p>
                            </div>

                            {/* 联系方式 */}
                            <div className='flex flex-wrap justify-center md:justify-start gap-3'>
                                {profile.contacts.github && (
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        asChild
                                        className={
                                            isCyberpunk
                                                ? 'border-secondary/50 hover:border-secondary'
                                                : ''
                                        }>
                                        <Link
                                            href={profile.contacts.github}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            aria-label='GitHub'>
                                            <Github
                                                className={`h-5 w-5 ${
                                                    isCyberpunk
                                                        ? 'text-secondary'
                                                        : ''
                                                }`}
                                            />
                                        </Link>
                                    </Button>
                                )}

                                {profile.contacts.email && (
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        asChild
                                        className={
                                            isCyberpunk
                                                ? 'border-secondary/50 hover:border-secondary'
                                                : ''
                                        }>
                                        <Link
                                            href={`mailto:${profile.contacts.email}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            aria-label='Email'>
                                            <Mail
                                                className={`h-5 w-5 ${
                                                    isCyberpunk
                                                        ? 'text-secondary'
                                                        : ''
                                                }`}
                                            />
                                        </Link>
                                    </Button>
                                )}

                                {profile.contacts.telegram && (
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        asChild
                                        className={
                                            isCyberpunk
                                                ? 'border-secondary/50 hover:border-secondary'
                                                : ''
                                        }>
                                        <Link
                                            href={`https://t.me/${profile.contacts.telegram}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            aria-label='Telegram'>
                                            <Send
                                                className={`h-5 w-5 ${
                                                    isCyberpunk
                                                        ? 'text-secondary'
                                                        : ''
                                                }`}
                                            />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </NeonBox>
    )
}
