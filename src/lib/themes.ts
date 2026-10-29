import {
  loadShikiTheme,
  type ExpressiveCodeTheme,
} from 'astro-expressive-code';
import { THEMES, type ThemeId } from '../config/themes';

export interface ThemePalette {
  colorScheme: 'light' | 'dark';
  background: string;
  foreground: string;
  accent: string;
  link: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  heading5: string;
  heading6: string;
  list: string;
  separator: string;
  note: string;
  tip: string;
  important: string;
  caution: string;
  warning: string;
}

const scopes = {
  foreground: ['editor.foreground'],
  background: ['editor.background'],
  accent: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading1: ['heading.1.markdown entity.name', 'heading.1.markdown', 'markup.heading.markdown', 'markup.heading'],
  heading2: ['heading.2.markdown entity.name', 'heading.2.markdown', 'markup.heading.markdown', 'markup.heading'],
  heading3: ['heading.3.markdown entity.name', 'heading.3.markdown', 'markup.heading.markdown', 'markup.heading'],
  heading4: ['heading.4.markdown entity.name', 'heading.4.markdown', 'markup.heading.markdown', 'markup.heading'],
  heading5: ['heading.5.markdown entity.name', 'heading.5.markdown', 'markup.heading.markdown', 'markup.heading'],
  heading6: ['heading.6.markdown entity.name', 'heading.6.markdown', 'markup.heading.markdown', 'markup.heading'],
  list: ['markup.list.bullet', 'punctuation.definition.list.begin.markdown'],
  link: ['string.other.link.title.markdown', 'markup.link'],
  separator: ['meta.separator.markdown', 'meta.separator'],
  note: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  tip: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  important: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  caution: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  warning: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
} as const;

function flattenTheme(theme: ExpressiveCodeTheme) {
  const syntax = theme.settings.reduce<Record<string, string>>((result, item) => {
    if (!item.scope || !item.settings.foreground) return result;
    for (const scope of item.scope) {
      result[scope] = item.settings.foreground.toLowerCase().trim();
    }
    return result;
  }, {});

  return { ...theme.colors, ...syntax } as Record<string, string>;
}

function firstColor(colors: Record<string, string>, candidates: readonly string[], fallback: string) {
  for (const candidate of candidates) {
    if (colors[candidate]) return colors[candidate];
  }
  return fallback;
}

let palettePromise: Promise<Record<ThemeId, ThemePalette>> | undefined;

export function getThemePalettes() {
  palettePromise ??= Promise.all(
    THEMES.map(async (themeId) => {
      const theme = await loadShikiTheme(themeId);
      const colors = flattenTheme(theme);
      const foreground = colors['editor.foreground'] ?? '#cdd6f4';
      const background = colors['editor.background'] ?? '#1e1e2e';
      const accent = firstColor(colors, scopes.accent, foreground);
      const link = firstColor(colors, scopes.link, accent);
      const heading1 = firstColor(colors, scopes.heading1, accent);
      const heading2 = firstColor(colors, scopes.heading2, heading1);
      const heading3 = firstColor(colors, scopes.heading3, heading2);

      const palette: ThemePalette = {
        colorScheme: theme.type === 'light' ? 'light' : 'dark',
        background,
        foreground,
        accent,
        link,
        heading1,
        heading2,
        heading3,
        heading4: firstColor(colors, scopes.heading4, heading3),
        heading5: firstColor(colors, scopes.heading5, heading3),
        heading6: firstColor(colors, scopes.heading6, heading3),
        list: firstColor(colors, scopes.list, accent),
        separator: firstColor(colors, scopes.separator, accent),
        note: firstColor(colors, scopes.note, link),
        tip: firstColor(colors, scopes.tip, heading3),
        important: firstColor(colors, scopes.important, heading2),
        caution: firstColor(colors, scopes.caution, heading2),
        warning: firstColor(colors, scopes.warning, heading1),
      };

      return [themeId, palette] as const;
    }),
  ).then((entries) => Object.fromEntries(entries) as Record<ThemeId, ThemePalette>);

  return palettePromise;
}
