"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || "1")

  // 创建新的查询参数对象
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // 生成页码数组
  const generatePagination = (currentPage: number, totalPages: number) => {
    // 如果总页数小于7，显示所有页码
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // 如果当前页接近开始
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages]
    }

    // 如果当前页接近结束
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    // 如果当前页在中间
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  const paginationArray = generatePagination(currentPage, totalPages)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <Button variant="outline" size="icon" disabled={currentPage <= 1} asChild={currentPage > 1}>
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)} aria-label="上一页">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      <div className="flex items-center space-x-2">
        {paginationArray.map((page, i) => {
          if (page === "...") {
            return (
              <Button key={`ellipsis-${i}`} variant="outline" size="icon" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )
          }

          const isCurrentPage = page === currentPage

          return (
            <Button
              key={`page-${page}`}
              variant={isCurrentPage ? "default" : "outline"}
              size="icon"
              asChild={!isCurrentPage}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {!isCurrentPage ? (
                <Link href={createPageURL(page)} aria-label={`第 ${page} 页`}>
                  {page}
                </Link>
              ) : (
                <span>{page}</span>
              )}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages ? true : false}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)} aria-label="下一页">
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  )
}
