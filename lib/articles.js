import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'articles')

export function getRecentArticles(count) {
    return getSortedArticles().reverse().slice(0, count)
}

export function getSortedArticles() {
    const fileNames = fs.readdirSync(articlesDirectory)
    const allArticles = fileNames.map(fileName => {
        const id = fileName.replace(/\.md/, '')
        const contents = fs.readFileSync(path.join(articlesDirectory, fileName))
        const matterResult = matter(contents)
        return {
            id,
            ...matterResult.data,
        }
    })
    return allArticles.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return -1
        } else if (a > b) {
            return 1
        } else {
            return 0
        }
    })
}

export function getArticleIds() {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        }
    })
}

export function getArticleData(id) {
    const content = fs.readFileSync(path.join(articlesDirectory, `${id}.md`), 'utf8')
    const matterResult = matter(content)
    return {
        id,
        content,
        ...matterResult.data,
    }
}

export function getTags() {
    const articles = getSortedArticles()
    const tagMap = new Map()
    let res = []
    articles.forEach(a => {
        a.tags.map(t => {
            tagMap.set(t, tagMap.has(t) ? tagMap.get(t).concat(a) : [a])
        })
    })
    tagMap.forEach((v, k) => {
        res.push({
            tag: k,
            articles: Array.from(new Set(v)),
        })
    })
    return res
}