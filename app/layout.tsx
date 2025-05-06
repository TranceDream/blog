import type React from 'react'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { MainNav } from '@/components/main-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { Background } from '@/components/background'
import './globals.css'
import './custom-emojis.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TranceDream的博客',
  description: 'TranceDream的博客',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
    <head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </head>
    <body className={`${inter.className} min-h-screen antialiased`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Background>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between py-4">
              <MainNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0 bg-background/80 backdrop-blur-sm">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                使用 Next.js 和 shadcn/ui 构建。
              </p>
            </div>
          </footer>
          {/* 添加全局返回顶部按钮 */}
          <ScrollToTopButton />
        </div>
      </Background>
    </ThemeProvider>
    </body>
    </html>
  )
}


import './globals.css'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'