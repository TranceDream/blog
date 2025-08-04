import { Separator } from '@/components/ui/separator'
import { FriendLinks } from '@/components/friend-link'
import { ProfileCard } from '@/components/profile-card'
import { friendLinks } from '@/config/friends'
import { profileData } from '@/config/profile'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '关于 | TranceDream的博客',
}

export default function AboutPage() {
    return (
        <div className='container py-16'>
            <div className='bg-background/80 backdrop-blur-sm rounded-xl shadow-lg'>
                <div className='space-y-12 p-8'>
                    {/* 个人资料部分 */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <h1 className='text-4xl font-bold tracking-tight'>
                                关于本站
                            </h1>
                            <Separator className='my-4' />
                        </div>
                        <ProfileCard profile={profileData} />
                    </div>

                    {/* 博客介绍部分 */}
                    <div className='space-y-6'>
                        <div className='prose dark:prose-invert max-w-none'>
                            <p>
                                这里存放我记录的md文档，平时会在这里写一些没用的东西，也会记录一下技术上遇到的问题和解决方案，至于技术文章的话，目前我还没有什么思路，想到了再去写吧。
                            </p>

                            <p>
                                本站当前版本大部分代码由
                                <a href={'https://v0.dev/'}>v0.dev</a>
                                生成。使用Next.js + shadcn/ui，支持主题切换。
                            </p>
                        </div>
                    </div>

                    {/* 友情链接板块 */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tight'>
                                友情链接
                            </h2>
                            <p className='text-muted-foreground'>
                                以下是一些非常棒的站点🥰
                            </p>
                            <Separator className='my-4' />
                        </div>
                        <FriendLinks friends={friendLinks} />
                    </div>
                </div>
            </div>
        </div>
    )
}
