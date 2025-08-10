'use client'

import { useMemo } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import rehypeReact from 'rehype-react'
import { createElement, Fragment } from 'react'
import remarkCustomEmojis from '@/lib/remark-custom-emojis'

// 表情符号映射
const emojiMap = {
    '1': '/emojis/face_1.png',
    '2': '/emojis/face_2.png',
    '3': '/emojis/face_3.png',
    '4': '/emojis/face_4.png',
    '5': '/emojis/face_5.png',
    '6': '/emojis/face_6.png',
    '7': '/emojis/face_7.png',
    '8': '/emojis/face_8.png',
    '9': '/emojis/face_9.png',
    '10': '/emojis/face_10.png',
    '11': '/emojis/face_11.png',
    '12': '/emojis/face_12.png',
    '13': '/emojis/face_13.png',
    '14': '/emojis/face_14.png',
    '15': '/emojis/face_15.png',
    '16': '/emojis/face_16.png',
    '17': '/emojis/face_17.png',
    '18': '/emojis/face_18.png',
    '19': '/emojis/face_19.png',
    '20': '/emojis/face_20.png',
    '21': '/emojis/face_21.png',
    '22': '/emojis/face_22.png',
    '23': '/emojis/face_23.png',
    '24': '/emojis/face_24.png',
    '25': '/emojis/face_25.png',
    '26': '/emojis/face_26.png',
    '27': '/emojis/face_27.png',
    '28': '/emojis/face_28.png',
    '29': '/emojis/face_29.png',
    '30': '/emojis/face_30.png',
    '31': '/emojis/face_31.png',
    '32': '/emojis/face_32.png',
    '33': '/emojis/face_33.png',
    '34': '/emojis/face_34.png',
    '35': '/emojis/face_35.png',
    '36': '/emojis/face_36.png',
    '37': '/emojis/face_37.png',
    '38': '/emojis/face_38.png',
    '39': '/emojis/face_39.png',
    '40': '/emojis/face_40.png',
    '41': '/emojis/face_41.png',
    '42': '/emojis/face_42.png',
    '43': '/emojis/face_43.png',
    '44': '/emojis/face_44.png',
    '45': '/emojis/face_45.png',
    '46': '/emojis/face_46.png',
    '47': '/emojis/face_47.png',
    '48': '/emojis/face_48.png',
    '49': '/emojis/face_49.png',
    '50': '/emojis/face_50.png',
}

// 自定义组件
const components = {
    h1: (props: any) => (
        <h1
            className='mt-10 scroll-m-20 text-4xl font-bold tracking-tight'
            {...props}
        />
    ),
    h2: (props: any) => (
        <h2
            className='mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'
            {...props}
        />
    ),
    h3: (props: any) => (
        <h3
            className='mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'
            {...props}
        />
    ),
    h4: (props: any) => (
        <h4
            className='mt-8 scroll-m-20 text-xl font-semibold tracking-tight'
            {...props}
        />
    ),
    p: (props: any) => (
        <p className='leading-7 [&:not(:first-child)]:mt-6' {...props} />
    ),
    ul: (props: any) => <ul className='my-6 ml-6 list-disc' {...props} />,
    ol: (props: any) => <ol className='my-6 ml-6 list-decimal' {...props} />,
    li: (props: any) => <li className='mt-2' {...props} />,
    blockquote: (props: any) => (
        <blockquote
            className='mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground'
            {...props}
        />
    ),
    img: (props: any) => {
        // 检查是否是内联表情符号
        if (props.className === 'custom-emojis') {
            return (
                <img
                    {...props}
                    style={{
                        display: 'inline',
                        verticalAlign: 'middle',
                        height: '1.2em',
                        width: 'auto',
                        margin: '0 0.1em',
                    }}
                />
            )
        }
        // 普通图片
        return <img className='rounded-md border' {...props} />
    },
    hr: (props: any) => (
        <hr className='my-8 border-muted-foreground/20' {...props} />
    ),
    table: (props: any) => (
        <div className='my-6 w-full overflow-y-auto'>
            <table className='w-full' {...props} />
        </div>
    ),
    tr: (props: any) => (
        <tr className='m-0 border-t p-0 even:bg-muted' {...props} />
    ),
    th: (props: any) => (
        <th
            className='border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
            {...props}
        />
    ),
    td: (props: any) => (
        <td
            className='border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
            {...props}
        />
    ),
    pre: (props: any) => (
        <pre
            className='mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4'
            {...props}
        />
    ),
    code: (props: any) => {
        // 检查是否是代码块
        const isCodeBlock = props.className?.includes('language-')
        if (isCodeBlock) {
            return <code {...props} />
        }
        // 内联代码
        return (
            <code
                className='relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm'
                {...props}
            />
        )
    },
}

interface MarkdownContentProps {
    content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    // 使用useMemo缓存处理结果，避免不必要的重新渲染
    const processedContent = useMemo(async () => {
        const processor = unified()
            .use(remarkParse) // 解析Markdown
            .use(remarkCustomEmojis, emojiMap) // 处理自定义表情符号
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true }) // 转换为HTML
            .use(rehypePrism, { ignoreMissing: true })
            .use(rehypeRaw) // 处理HTML标签
            .use(rehypeReact, { createElement, Fragment, components }) // 转换为React组件

        const processed = await processor.process(content)
        return processed.result
    }, [content])

    return (
        <div className='prose dark:prose-invert max-w-none'>
            {processedContent}
        </div>
    )
}
