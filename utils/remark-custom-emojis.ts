import { visit } from 'unist-util-visit'

export default function remarkCustomEmojis(emojiMap: Record<string, string>) {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /@([^@]+)@/g
      const value = node.value

      let match
      let lastIndex = 0
      const children = [] // 存储处理后的节点

      // 遍历匹配到的所有表情
      while ((match = regex.exec(value)) !== null) {
        const emojiKey = match[1]
        const startIndex = match.index

        // 处理匹配前的普通文本
        if (startIndex > lastIndex) {
          children.push({
            type: 'text',
            value: value.slice(lastIndex, startIndex),
          })
        }

        // 替换表情为 <img> 标签
        if (emojiMap[emojiKey]) {
          children.push({
            type: 'html',
            value: `<img src="${emojiMap[emojiKey]}" alt="${emojiKey}" class="custom-emojis" />`,
          })
        } else {
          // 如果表情key不存在，保留原文本
          children.push({
            type: 'text',
            value: match[0],
          })
        }

        lastIndex = regex.lastIndex
      }

      // 处理剩余的普通文本
      if (lastIndex < value.length) {
        children.push({
          type: 'text',
          value: value.slice(lastIndex),
        })
      }

      // 替换当前节点为新的子节点数组
      if (children.length > 0 && parent && Array.isArray(parent.children)) {
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}
