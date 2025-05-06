import Image from "next/image"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/markdown"
import { formatDate } from "@/lib/utils"
import { MarkdownContent } from "@/components/markdown"
import { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent((await params).slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    return {
      title: "文章未找到 | TranceDream的博客",
    }
  }

  return {
    title: `${post.title} | TranceDream的博客`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // 对slug进行URL解码，以处理URL编码的文件名
  const decodedSlug = decodeURIComponent(params.slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    console.error("Post not found for slug:", decodedSlug)
    notFound()
  }

  return (
    <div className="container py-16">
      <article className="bg-background/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="space-y-8 p-8">
          <div className="space-y-4">
            <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">{post.title}</h1>
            {post.date && <p className="text-muted-foreground">{formatDate(post.date)}</p>}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-lg shadow-md">
            <Image
              src={post.coverImage || "/placeholder.webp"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <MarkdownContent content={post.content} />
          </div>
        </div>
      </article>
    </div>
  )
}
