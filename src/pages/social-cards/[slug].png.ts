import siteConfig from '~/site.config'
import { Resvg } from '@resvg/resvg-js'
import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { dateString, getSortedPosts, resolveThemeColorStyles } from '~/utils'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import type { ReactNode } from 'react'

// Get __dirname for path resolution
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to load a reliable font for social cards
// Uses a simple, static font that works everywhere
async function loadFont(): Promise<Buffer> {
  // Try multiple font sources in order of preference
  const fontSources = [
    // 1. Try local Maple Mono font (if available and not variable font)
    () => {
      try {
        const fontPath = path.resolve(__dirname, '../../MapleMono-CN.ttf')
        if (fs.existsSync(fontPath)) {
          return fs.readFileSync(fontPath)
        }
      } catch (e) {
        // Ignore file errors
      }
      return null
    },
    // 2. Try alternative paths for Maple Mono
    () => {
      try {
        const altPaths = [
          path.resolve(process.cwd(), 'src/MapleMono-CN.ttf'),
          path.resolve(process.cwd(), './src/MapleMono-CN.ttf'),
        ]
        for (const altPath of altPaths) {
          if (fs.existsSync(altPath)) {
            return fs.readFileSync(altPath)
          }
        }
      } catch (e) {
        // Ignore file errors
      }
      return null
    },
    // 1. Try to use a simple font from Google Fonts (Roboto is very reliable)
    async () => {
      try {
        const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf')
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          return Buffer.from(arrayBuffer)
        }
      } catch (e) {
        // Ignore fetch errors
      }
      return null
    },
  ]

  // Try each source in order
  for (const source of fontSources) {
    try {
      const fontData = await source()
      if (fontData) {
        return fontData
      }
    } catch (error) {
      // Continue to next source
      continue
    }
  }

  // If all sources fail, throw error
  throw new Error('Could not load any font for social card generation. Satori requires at least one font file.')
}

// Helper function to load avatar image
function loadAvatar(): string | undefined {
  try {
    const avatarPath = path.isAbsolute(siteConfig.socialCardAvatarImage)
      ? siteConfig.socialCardAvatarImage
      : path.resolve(__dirname, '../../', siteConfig.socialCardAvatarImage)
    
    if (!fs.existsSync(avatarPath)) {
      return undefined
    }
    
    const ext = path.extname(avatarPath).toLowerCase()
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp']
    
    if (!supportedFormats.includes(ext)) {
      console.warn(`Avatar image format ${ext} is not supported. Supported formats: ${supportedFormats.join(', ')}`)
      return undefined
    }
    
    const avatarData = fs.readFileSync(avatarPath)
    
    // Determine MIME type based on file extension
    let mimeType: string
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg'
        break
      case '.png':
        mimeType = 'image/png'
        break
      case '.webp':
        mimeType = 'image/webp'
        break
      default:
        mimeType = 'image/jpeg' // fallback
    }
    
    return `data:${mimeType};base64,${avatarData.toString('base64')}`
  } catch (error) {
    console.warn('Failed to load avatar image:', error)
    return undefined
  }
}

const avatarBase64 = loadAvatar()

const defaultTheme =
  siteConfig.themes.default === 'auto'
    ? siteConfig.themes.include[0]
    : siteConfig.themes.default

const themeStyles = await resolveThemeColorStyles(
  [defaultTheme],
  siteConfig.themes.overrides,
)
const bg = themeStyles[defaultTheme]?.background
const fg = themeStyles[defaultTheme]?.foreground
const accent = themeStyles[defaultTheme]?.accent

if (!bg || !fg || !accent) {
  throw new Error(`Theme ${defaultTheme} does not have required colors`)
}

// Helper function to create font options
// Uses a reliable font source that works in all environments
async function createFontOptions(): Promise<SatoriOptions['fonts']> {
  try {
    const fontData = await loadFont()
    // Try to determine font name from data, but use a safe default
    // Roboto is a safe choice if we loaded from Google Fonts
    const fontName = 'Roboto' // Default to Roboto which is reliable
    
    return [
      {
        data: fontData,
        name: fontName,
        style: 'normal',
        weight: 400,
      },
    ]
  } catch (error) {
    console.error('Failed to load font:', error)
    throw new Error('Font loading failed. Satori requires at least one font file to render text.')
  }
}

const markup = (title: string, pubDate: string | undefined, author: string) =>
  html(`<div tw="flex flex-col max-w-full justify-center h-full bg-[${bg}] text-[${fg}] p-12">
    <div style="border-width: 12px; border-radius: 80px;" tw="flex items-center max-w-full p-8 border-[${accent}]/30">
      ${
        avatarBase64
          ? `<div tw="flex flex-col justify-center items-center w-1/3 h-100">
            <img src="${avatarBase64}" tw="flex w-full rounded-full border-[${accent}]/30" />
        </div>`
          : ''
      }
      <div tw="flex flex-1 flex-col max-w-full justify-center items-center">
        ${pubDate ? `<p tw="text-3xl max-w-full text-[${accent}]">${pubDate}</p>` : ''}
        <h1 tw="text-6xl my-14 text-center leading-snug">${title}</h1>
        ${author !== title ? `<p tw="text-4xl text-[${accent}]">${author}</p>` : ''}
      </div>
    </div>
  </div>`)

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export async function GET(context: APIContext) {
  const { pubDate, title, author } = context.props as Props
  
  try {
    // Load font - this will try multiple sources and use the first one that works
    const fonts = await createFontOptions()
    
    const ogOptions: SatoriOptions = {
      fonts,
      height: 630,
      width: 1200,
    }
    
    // Generate the social card
    const svg = await satori(markup(title, pubDate, author) as ReactNode, ogOptions)
    const png = new Resvg(svg).render().asPng()
    
    return new Response(new Uint8Array(png), {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error('Failed to generate social card:', error)
    throw error
  }
}

export async function getStaticPaths() {
  const posts = await getSortedPosts()
  return posts
    .map((post) => ({
      params: { slug: post.id },
      props: {
        pubDate: post.data.published ? dateString(post.data.published) : undefined,
        title: post.data.title,
        author: post.data.author || siteConfig.author,
      },
    }))
    .concat([
      {
        params: { slug: '__default' },
        props: { pubDate: undefined, title: siteConfig.title, author: siteConfig.author },
      },
    ])
}
