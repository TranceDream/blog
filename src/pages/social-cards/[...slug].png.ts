import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '../../config/site';
import { DEFAULT_THEME } from '../../config/themes';
import { formatDate, getVisiblePosts } from '../../lib/posts';
import { getThemePalettes } from '../../lib/themes';

interface Card { title: string; author: string; date?: string }

// Build-only assets: the Chinese font is never downloaded by readers.
const font = readFile(resolve('src/assets/fonts/MapleMono-CN.ttf'));
const avatar = SITE.profile.avatar
  ? sharp(resolve('public', SITE.profile.avatar.replace(/^\//, '')))
      .resize(280, 280, { fit: 'cover' }).png().toBuffer()
      .then(buffer => `data:image/png;base64,${buffer.toString('base64')}`)
  : Promise.resolve(undefined);

export const getStaticPaths: GetStaticPaths = async () => [
  { params: { slug: '__default' }, props: { title: SITE.title, author: SITE.author } },
  ...(await getVisiblePosts()).filter(post => post.data.type !== 'note').map(post => ({
    params: { slug: post.id },
    props: {
      title: post.data.title!,
      author: post.data.author || SITE.author,
      date: formatDate(post.data.publishedAt),
    },
  })),
];

export const GET: APIRoute = async ({ props }) => {
  const { title, author, date } = props as Card;
  const palette = (await getThemePalettes())[DEFAULT_THEME];
  const avatarUrl = await avatar;
  const frameColor = `${palette.accent.slice(0, 7)}4d`;
  const titleSize = [...title].length > 45 ? 42 : [...title].length > 28 ? 50 : 60;
  const text = (value: string, size: number, color: string) => ({
    type: 'div', props: { style: { fontSize: size, color, textAlign: 'left' }, children: value },
  });
  const svg = await satori({
    type: 'div',
    props: {
      style: {
        display: 'flex', width: 1200, height: 630, padding: 24, boxSizing: 'border-box',
        backgroundColor: palette.background, color: palette.foreground, fontFamily: 'Maple Mono',
      },
      children: {
        type: 'div', props: {
          style: {
            display: 'flex', alignItems: 'center', gap: 32, width: 1152, height: 582, boxSizing: 'border-box',
            padding: 44, border: `12px solid ${frameColor}`, borderRadius: 80,
          },
          children: [
            ...(avatarUrl ? [{ type: 'img', props: {
              src: avatarUrl, width: 280, height: 280,
              style: { borderRadius: 140, flexShrink: 0 },
            } }] : []),
            { type: 'div', props: {
              style: {
                display: 'flex', width: avatarUrl ? 728 : 1040, flex: 1, minWidth: 0, flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'flex-start', gap: 32,
              },
              children: [
                ...(date ? [text(date, 30, palette.accent)] : []),
                { type: 'div', props: {
                  style: { width: '100%', fontSize: titleSize, textAlign: 'left', lineHeight: 1.35, wordBreak: 'break-word', lineClamp: 4 },
                  children: title,
                } },
                ...(author !== title ? [text(author, 36, palette.accent)] : []),
              ],
            } },
          ],
        },
      },
    },
  }, { width: 1200, height: 630, fonts: [{ name: 'Maple Mono', data: await font, weight: 400, style: 'normal' }] });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
