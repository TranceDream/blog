// lib/rehype-emoji-element.ts
import { visit } from 'unist-util-visit'

export default function rehypeEmojiElement() {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            if (node.tagName !== 'img') return
            const props = node.properties ?? {}
            const cls = props.className
            const classes = Array.isArray(cls)
                ? cls
                : typeof cls === 'string'
                ? cls.split(/\s+/)
                : []

            const isEmoji =
                classes.includes('custom-emojis') ||
                (typeof props.src === 'string' &&
                    props.src.startsWith('/emojis/'))

            if (isEmoji) {
                node.tagName = 'emoji-img' // ← 改名，后面用 components['emoji-img'] 接管
            }
        })
    }
}
