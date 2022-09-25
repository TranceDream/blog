import path from 'path'
import fs from 'fs'

const configPath = path.join(process.cwd(), '/config.json')
const introductionPath = path.join(process.cwd(), '/introduction.md')

function BlogConfig(logo, background, title, slogan) {
    this.logo = logo
    this.background = background
    this.title = title
    this.slogan = slogan
}

function IntroConfig(name, avatar, social, introduction) {
    this.name = name
    this.avatar = avatar
    this.introduction = introduction
    this.social = { ...social }
}

function getConfig() {
    return JSON.parse(fs.readFileSync(configPath).toString('utf-8'))
}

export function getBlogConfig() {
    const obj = getConfig()['blog']
    const logo = (obj['logo'] == null || obj['logo'] === '') ? '/logo.svg' : obj['logo']
    const background = (obj['background'] == null || obj['background'] === '') ? null : obj['background']
    const title = obj['title'] ?? ''
    const slogan = obj['slogan'] ?? ''
    return new BlogConfig(logo, background, title, slogan)
}

export function getIntroConfig() {
    const obj = getConfig()['intro'] ?? {}
    const name = obj['name'] == null ? '' : obj['name']
    const avatar = (obj['avatar'] == null || obj['avatar'] === 'https://xsgames.co/randomusers/avatar.php?g=male') ? '/logo.svg' : obj['avatar']
    const social = obj['social'] == null ? {} : obj['social']
    const introduction = fs.readFileSync(introductionPath).toString('utf-8')
    return new IntroConfig(name, avatar, social, introduction)
}