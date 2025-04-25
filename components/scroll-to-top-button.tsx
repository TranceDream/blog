"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const isCyberpunk = theme === "cyberpunk"

  // 监听滚动事件，决定按钮是否可见
  useEffect(() => {
    const toggleVisibility = () => {
      // 当页面滚动超过300px时显示按钮
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    // 初始检查
    toggleVisibility()

    // 清理事件监听
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // 滚动到顶部的函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        aria-label="返回顶部"
        className={cn(
          "rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background/90",
          isCyberpunk && "border-secondary hover:border-secondary/80",
        )}
      >
        <ArrowUp className={cn("h-5 w-5", isCyberpunk && "text-secondary")} />
      </Button>
    </div>
  )
}
