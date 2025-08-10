'use client'

export default function ToolPage() {
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

    return (
        <main className='container mx-auto px-4 py-8 max-w-4xl'>
            <h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>
                表情代码对照表
            </h2>

            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                <table className='w-full'>
                    <caption className='bg-gray-50 px-6 py-4 text-lg font-semibold text-gray-700 border-b'>
                        表情代码对照表(点击复制)
                    </caption>
                    <thead>
                        <tr className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                            <th className='px-6 py-4 text-left font-semibold text-lg w-1/3'>
                                表情
                            </th>
                            <th className='px-6 py-4 text-left font-semibold text-lg w-2/3'>
                                代码
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(emojiMap).map(([key, value], index) => {
                            return (
                                <tr
                                    key={`@${key}@`}
                                    className={`
                                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                hover:bg-blue-50 transition-colors duration-200
                                border-b border-gray-200 last:border-b-0
                            `}>
                                    <td className='px-6 py-4'>
                                        <div className='flex justify-center'>
                                            <img
                                                src={value}
                                                alt={key}
                                                className='w-8 h-8 object-contain hover:scale-110 transition-transform duration-200'
                                            />
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <p
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `@${key}@`
                                                )
                                            }}
                                            className='
                                        inline-block px-4 py-2 bg-gray-100 
                                        hover:bg-blue-100 active:bg-blue-200
                                        rounded-md cursor-pointer 
                                        font-mono text-sm text-gray-700
                                        transition-all duration-200
                                        hover:shadow-md
                                        select-none
                                        border border-gray-200
                                        hover:border-blue-300
                                    '
                                            title='点击复制代码'>
                                            @{key}@
                                        </p>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
