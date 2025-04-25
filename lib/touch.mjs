#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import dayjs from 'dayjs'

// 获取文件路径和目录名工具
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取命令行参数
const filePath = process.argv[2]

// 检查文件路径是否提供
if (!filePath) {
  console.error("错误: 请提供一个文件路径，例如 'pnpm touch <文件路径>'")
  process.exit(1)
}

// 解析文件路径
const absolutePath = path.resolve(filePath)

// 检查文件是否存在
if (!fs.existsSync(absolutePath)) {
  console.error(`错误: 文件路径 '${absolutePath}' 不存在`)
  process.exit(1)
}

try {
  // 读取文件内容
  const fileContent = fs.readFileSync(absolutePath, 'utf-8')

  // 使用 gray-matter 解析 frontmatter
  const parsed = matter(fileContent)

  // 更新 date 字段为当前日期
  const updatedFrontmatter = {
    ...parsed.data,
    date: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ss'), // 设置为最新的 ISO 日期
  }

  // 生成更新后的内容
  const updatedContent = matter.stringify(parsed.content, updatedFrontmatter)

  // 写回文件
  fs.writeFileSync(absolutePath, updatedContent, 'utf-8')

  console.log(`成功更新文件: ${absolutePath}`)
} catch (error) {
  console.error(`错误: 无法处理文件 '${absolutePath}'`)
  console.error(error.message)
  process.exit(1)
}
