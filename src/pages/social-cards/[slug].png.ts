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

// Helper function to load font file
function loadFont(): Buffer | null {
  try {
    const fontPath = path.resolve(__dirname, '../../MapleMono.ttf')

    if (fs.existsSync(fontPath)) {
      return fs.readFileSync(fontPath)
    }
    
    // Fallback: try alternative paths
    const altPaths = [
      path.resolve(process.cwd(), 'src/MapleMono.ttf'),
      path.resolve(process.cwd(), './src/MapleMono.ttf'),
    ]
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        return fs.readFileSync(altPath)
      }
    }
    
    console.warn('Font file not found, will use system fonts')
    return null
  } catch (error) {
    console.warn('Failed to load font file:', error)
    return null
  }
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
function createFontOptions(): SatoriOptions['fonts'] {
  const fontData = loadFont()
  if (!fontData) {
    return [] // Use system fonts as fallback
  }
  
  return [
    {
      data: fontData,
      name: 'Maple Mono',
      style: 'normal',
      weight: 400,
    },
  ]
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
  
  const ogOptions: SatoriOptions = {
    fonts: createFontOptions(),
    height: 630,
    width: 1200,
  }
  
  try {
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
    // If font parsing fails (e.g., variable font issue), try without custom font
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (
      errorMessage.includes('fvar') ||
      errorMessage.includes('opentype') ||
      errorMessage.includes('Cannot read properties')
    ) {
      console.warn('Font parsing error detected, retrying without custom font')
      const fallbackOptions: SatoriOptions = {
        ...ogOptions,
        fonts: [], // Use system fonts as fallback
      }
      try {
        const svg = await satori(markup(title, pubDate, author) as ReactNode, fallbackOptions)
        const png = new Resvg(svg).render().asPng()
        return new Response(new Uint8Array(png), {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': 'image/png',
          },
        })
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        throw fallbackError
      }
    }
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
