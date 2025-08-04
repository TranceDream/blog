import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/lib/markdown'

interface PostCardProps {
    post: Post
    isLast: boolean
}

export function PostCard({ post, isLast }: PostCardProps) {
    return (
        <div className='w-full'>
            <Card className='overflow-hidden border-none shadow-none bg-transparent'>
                <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
                    <div className='relative aspect-video overflow-hidden rounded-lg shadow-md'>
                        <Link href={`/posts/${post.slug}`}>
                            <Image
                                src={post.coverImage || '/placeholder.webp'}
                                alt={post.title}
                                fill
                                className='object-cover transition-transform hover:scale-105'
                            />
                        </Link>
                    </div>
                    <CardContent className='flex flex-col justify-center p-0 space-y-4'>
                        <div className='space-y-3'>
                            <div className='flex flex-wrap gap-2'>
                                {post.tags &&
                                    post.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant='secondary'
                                            className='font-normal'>
                                            {tag}
                                        </Badge>
                                    ))}
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                {formatDate(post.date)}
                            </p>
                            <Link
                                href={`/posts/${post.slug}`}
                                className='group'>
                                <h3 className='text-2xl font-bold tracking-tight group-hover:underline'>
                                    {post.title}
                                </h3>
                            </Link>
                            <p className='text-muted-foreground'>
                                {post.description || post.excerpt}
                            </p>
                        </div>
                        <div className='pt-2'>
                            <Button asChild variant='link' className='px-0'>
                                <Link href={`/posts/${post.slug}`}>
                                    阅读全文
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
            {!isLast && <Separator className='my-12' />}
        </div>
    )
}
