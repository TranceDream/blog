import Link from "next/link"
import { getAllPosts } from "@/lib/markdown"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HeroSection } from "@/components/hero-section"
import { PostCard } from "@/components/post-card"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "TranceDream的博客",
}

export default async function Home() {
  // 只获取最近的3篇文章
  const posts = (await getAllPosts()).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* 使用英雄部分组件 */}
      <HeroSection />

      {/* 文章列表部分 */}
      <section className="container py-16">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl -mt-8 relative z-10 p-8 shadow-lg">
          <div className="space-y-12">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">最新文章</h2>
                <Separator className="w-full md:w-[250px]" />
              </div>
              <Button asChild variant="outline">
                <Link href="/archive">查看所有文章</Link>
              </Button>
            </div>

            <div className="space-y-0">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} isLast={index === posts.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
