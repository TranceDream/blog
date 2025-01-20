'use client'
import styles from '@/app/tool/page.module.scss'

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
    <main className={styles.main}>
      <h2>表情代码对照表</h2>
      <table>
        <caption>表情代码对照表(点击复制)</caption>
        <thead>
          <tr>
            <th>表情</th>
            <th>代码</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(emojiMap).map(([key, value]) => {
            return (
              <tr key={`@${key}@`}>
                <td>
                  <img src={value} alt={key} className='custom-emojis'></img>
                </td>
                <td>
                  <p
                    className={styles.code}
                    onClick={() => {
                      navigator.clipboard.writeText(`@${key}@`)
                    }}
                  >
                    @{key}@
                  </p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
