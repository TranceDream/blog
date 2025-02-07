#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'

// 定义交互问题
const questions = [
  {
    type: 'input',
    name: 'title',
    message: '请输入文章标题：',
    validate: input => (input ? true : '标题不能为空！'),
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入文章描述：',
  },
  {
    type: 'input',
    name: 'tags',
    message: '请输入文章标签（用逗号分隔）：',
  },
  {
    type: 'input',
    name: 'cover',
    message: '请输入头图url：',
  },
]

;(async () => {
  try {
    // 运行命令行交互
    const answers = await inquirer.prompt(questions)

    const date = Date.now()

    // 生成 Frontmatter
    const frontmatter = `---
title: "${answers.title}"
description: "${answers.description}"
tags: [${answers.tags
      .split(',')
      .map(tag => `"${tag.trim()}"`)
      .join(', ')}]
date: "${dayjs(date).format('YYYY-MM-DDTHH:mm:ss')}"${answers.cover ? `\ncover: "${answers.cover}"` : ''}
---

`

    // 文件路径
    const fileName = `${dayjs(date).format('YYYY-MM-DD')}_${nanoid(10)}_${answers.title.toLowerCase().replace(/ /g, '-')}.md`
    const filePath = path.join(process.cwd(), 'content', fileName)

    // 写入文件
    fs.mkdirSync(path.dirname(filePath), { recursive: true }) // 确保目录存在
    fs.writeFileSync(filePath, frontmatter, 'utf8')

    console.log(`Markdown 文件已生成: ${filePath}`)
  } catch (err) {
    console.error('生成 Markdown 文件失败:', err)
  }
})()
