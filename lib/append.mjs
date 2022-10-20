import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import chalk from 'chalk'

(function() {
    const articlesDirectory = path.join(process.cwd(), 'articles')
    const year = dayjs().year()
    const month = dayjs().month() + 1
    const day = dayjs().date()
    const prefix = `${year}-${month}-${day}`
    const frontmatter = `---\ntitle: ''\ndate: '${prefix}'\ndesc: ''\ncover: ''\ntags:\n    - tag\n    - tag\n---\n`
    const fileNames = fs.readdirSync(articlesDirectory)
    while (true) {
        let suffix = nanoid(10)
        let fileName = prefix + '-' + suffix + '.md'
        if (!fileNames.includes(fileName)) {
            fs.writeFileSync(path.join(articlesDirectory, fileName), frontmatter)
            console.log(chalk.greenBright('Successfully create article: ') + chalk.underline(fileName))
            break
        }
    }
})()