declare module '@pagefind/default-ui' {
  declare class PagefindUI {
    constructor(arg: unknown)
  }
}

// Type declarations for vite-plugin-font
declare module '*.ttf?subsets' {
  export const css: {
    family: string
    weight: string | number
    style: string
  }
  export const fontFamilyFallback: string
}
