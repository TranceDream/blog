import '@/app/global.scss'

import type { Metadata, Viewport } from 'next'
import { Crimson_Pro, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'
import ProgressBarProvider from '@/components/progress-bar-provider'

const fontCrimsonPro = Crimson_Pro({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-crimson-pro',
})

const fontNotoSerifSC = Noto_Serif_SC({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'],
  variable: '--font-noto-serif-sc',
})

const fontJetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'TranceDream的博客',
  description: 'TranceDream的博客',
}

export const viewport: Viewport = {
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='zh-CN'
      className={[
        fontCrimsonPro.variable,
        fontNotoSerifSC.variable,
        fontJetbrainsMono.variable,
      ].join(' ')}
    >
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
      </head>
      <body>
        <ProgressBarProvider>{children}</ProgressBarProvider>
      </body>
    </html>
  )
}
