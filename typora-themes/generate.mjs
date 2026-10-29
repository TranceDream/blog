// Run from the repository: node typora-themes/generate.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { loadShikiTheme } from 'astro-expressive-code';

const directory = new URL('./', import.meta.url);
const root = fileURLToPath(new URL('../', directory));
const server = await createServer({ root, configFile: false, cacheDir: 'node_modules/.vite-typora', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { THEMES } = await server.ssrLoadModule('/src/config/themes.ts');
  const { getThemePalettes } = await server.ssrLoadModule('/src/lib/themes.ts');
  const palettes = await getThemePalettes();
  const base = await readFile(new URL('src/base.css', directory), 'utf8');
  const manifest = [];

  // Resolve TextMate foreground scopes into the smaller CodeMirror token set.
  function token(theme, scopes, fallback) {
    for (const scope of scopes) {
      let match;
      let specificity = -1;
      for (const rule of theme.settings) {
        for (const candidate of rule.scope ?? []) {
          if ((scope === candidate || scope.startsWith(candidate + '.')) && candidate.length >= specificity && rule.settings.foreground) {
            specificity = candidate.length;
            match = rule.settings.foreground;
          }
        }
      }
      if (match) return match;
    }
    return fallback;
  }

  // Precompute mixtures so themes also work on Typora versions without color-mix().
  function mix(first, second, weight) {
    const rgb = (hex) => {
      const value = hex.slice(1);
      const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
      if (!/^[a-f\d]{6}([a-f\d]{2})?$/i.test(full)) throw new Error(`Unsupported color: ${hex}`);
      return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
    };
    const a = rgb(first), b = rgb(second);
    return '#' + a.map((value, i) => Math.round(value * weight + b[i] * (1 - weight)).toString(16).padStart(2, '0')).join('');
  }

  for (const id of THEMES) {
    const p = palettes[id];
    const theme = await loadShikiTheme(id);
    const vars = {
      bg: p.background, text: p.foreground, accent: p.accent, link: p.link,
      muted: mix(p.foreground, p.background, 0.72), faint: mix(p.foreground, p.background, 0.52),
      surface: mix(p.foreground, p.background, 0.05), raised: mix(p.foreground, p.background, 0.09),
      line: mix(p.foreground, p.background, 0.18), selection: mix(p.accent, p.background, 0.25),
      list: p.list, separator: p.separator,
      ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => [`h${n}`, p[`heading${n}`]])),
      comment: token(theme, ['comment.line', 'comment'], mix(p.foreground, p.background, 0.55)),
      keyword: token(theme, ['keyword.control', 'keyword'], p.accent),
      string: token(theme, ['string.quoted.double', 'string'], p.tip),
      number: token(theme, ['constant.numeric', 'constant'], p.caution),
      variable: token(theme, ['variable.other.readwrite', 'variable'], p.foreground),
      function: token(theme, ['entity.name.function', 'support.function'], p.link),
      type: token(theme, ['entity.name.type', 'support.type'], p.heading2),
      property: token(theme, ['variable.other.property', 'support.type.property-name'], p.link),
      operator: token(theme, ['keyword.operator'], p.accent),
      tag: token(theme, ['entity.name.tag'], p.heading1),
      attribute: token(theme, ['entity.other.attribute-name'], p.heading2),
      error: p.warning,
    };
    const filename = `multiterm-${id}.css`;
    const header = `/* MultiTerm / ${id}\n * Generated from this blog's Shiki palette. See README.md and LICENSE-shiki.txt.\n * Standalone theme: no network requests, fonts or shared files required.\n */\n`;
    const variables = `:root {\n  color-scheme: ${p.colorScheme};\n${Object.entries(vars).map(([key, value]) => `  --mt-${key}: ${value};`).join('\n')}\n}\n`;
    await writeFile(new URL(filename, directory), header + variables + '\n' + base);
    manifest.push({ id, file: filename, mode: p.colorScheme, background: p.background, foreground: p.foreground, accent: p.accent });
  }
  await writeFile(new URL('manifest.json', directory), JSON.stringify(manifest, null, 2) + '\n');
  const preview = await readFile(new URL('src/preview.html', directory), 'utf8');
  await writeFile(new URL('preview.html', directory), preview.replace('/* THEME_MANIFEST */[]', JSON.stringify(manifest)));
  await writeFile(new URL('LICENSE-shiki.txt', directory), await readFile(new URL('../node_modules/@shikijs/themes/LICENSE', directory), 'utf8'));
  console.log(`Generated ${manifest.length} standalone Typora themes (${manifest.filter((x) => x.mode === 'dark').length} dark, ${manifest.filter((x) => x.mode === 'light').length} light).`);
} finally {
  await server.close();
}
