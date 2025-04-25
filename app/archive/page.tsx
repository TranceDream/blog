import { getAllPosts } from "@/lib/markdown"
import { Separator } from "@/components/ui/separator"
import { Pagination } from "@/components/pagination"
import { PostCard } from "@/components/post-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "归档 | TranceDream的博客",
}

// 每页显示的文章数量
const POSTS_PER_PAGE = 10

export default async function ArchivePage({
                                            searchParams,
                                          }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 获取所有文章
  const allPosts = await getAllPosts()

  // 获取当前页码
  const currentPage = Number(searchParams.page || "1")

  // 计算总页数
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  // 计算当前页的文章
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = allPosts.slice(startIndex, endIndex)

  return (
    <div className="container py-16">
      <div className="bg-background/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="space-y-12 p-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">文章归档</h2>
            <p className="text-muted-foreground">浏览所有博客文章</p>
            <Separator />
          </div>

          <div className="space-y-0">
            {currentPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} isLast={index === currentPosts.length - 1} />
            ))}
          </div>

          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}
