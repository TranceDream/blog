import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharedCss from './shared.css?url';
import bridge from './theme-bridge.js?url';

const root = resolve('src/content/labs');
import { assetTypes as types } from './asset-types';

async function assets(directory: string, prefix: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.includes('.test.')) continue;
    const path = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) result.push(...await assets(join(directory, entry.name), path));
    else if (entry.isFile() && types[entry.name.split('.').pop()!]) result.push(path);
  }
  return result;
}
export const getStaticPaths: GetStaticPaths = async ({ routePattern }) => {
  const paths = [];
  for (const lab of await getCollection('labs')) {
    const directory = join(root, lab.id);
    await stat(join(directory, 'index.html'));
    for (const path of await assets(directory, lab.id)) {
      if (path.endsWith(`.${routePattern.split('.').pop()}`)) {
        paths.push({ params: { slug: path.slice(0, path.lastIndexOf('.')) }, props: { path } });
      }
    }
  }
  return paths;
};
export const GET: APIRoute = async ({ props }) => {
  const path = props.path as string;
  const extension = path.split('.').pop()!;
  const file = await readFile(join(root, path));
  if (extension !== 'html') return new Response(new Uint8Array(file), { headers: { 'Content-Type': types[extension] } });
  const html = file.toString().replace(/<head\b[^>]*>/i, head => `${head}\n<link rel="stylesheet" href="${sharedCss}">\n<script src="${bridge}"></script>`);
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
