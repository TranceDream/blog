/**
 * Article
 * 文章信息接口描述
 */
export declare interface Article {
  /** 文章标识 */
  slug: string

  /** 文章标题 */
  title: string

  /** 文章描述 */
  description: string

  /** 文章生成日期 */
  date: Date

  /** 文章标签 */
  tags: string[]

  /** 文章头图URL */
  cover?: string

  /** 文章内容 */
  content: string
}

export declare type Frontmatter = Omit<Article, 'content'>
