import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 修正路径，指向content目录
const postsDirectory = path.join(process.cwd(), "content")

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  description?: string
  tags?: string[]
  coverImage: string
  content: string
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    console.log("Looking for slug:", slug)
    console.log("Posts directory:", postsDirectory)

    // 列出目录中的所有文件，帮助调试
    const files = fs.readdirSync(postsDirectory)
    console.log("Available files:", files.length)

    // 尝试查找匹配的文件，不依赖于精确的文件名
    const matchingFile = files.find((file) => {
      // 移除.md扩展名后比较
      const fileSlug = file.replace(/\.md$/, "")
      return fileSlug === slug || decodeURIComponent(fileSlug) === decodeURIComponent(slug)
    })

    if (!matchingFile) {
      console.error(`No matching file found for slug: ${slug}`)
      return null
    }

    console.log("Found matching file:", matchingFile)

    // 使用找到的匹配文件名
    const filePath = path.join(postsDirectory, matchingFile)
    console.log("Reading file from:", filePath)

    const fileContents = fs.readFileSync(filePath, "utf8")

    // 使用 gray-matter 解析文章元数据部分
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: (data.description as string) || (data.excerpt as string) || "",
      description: data.description as string,
      tags: data.tags as string[],
      coverImage: (data.cover as string) || "/placeholder.webp?height=600&width=1200",
      content: content,
    }
  } catch (error) {
    console.error(`Error processing markdown for ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
      console.log("Created content directory at:", postsDirectory)
    }

    // 读取目录中的所有文件
    const fileNames = fs.readdirSync(postsDirectory)
    console.log("Found files in content directory:", fileNames)

    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          // 从文件名中提取slug，不包含.md扩展名
          const slug = fileName.replace(/\.md$/, "")
          try {
            return await getPostBySlug(slug)
          } catch (error) {
            console.error(`Error processing file ${fileName}:`, error)
            return null
          }
        }),
    )

    // 过滤掉任何空值并按日期排序
    return allPostsData
      .filter((post): post is Post => post !== null)
      .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
  } catch (error) {
    console.error("Error getting all posts:", error)
    return []
  }
}
