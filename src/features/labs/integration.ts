import type { AstroIntegration } from 'astro';
import { assetTypes } from './asset-types';

interface Options {
  enabled: boolean;
}

export default function labsFeature({ enabled }: Options): AstroIntegration {
  return {
    name: 'tranced:labs',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        if (!enabled) return;

        injectRoute({
          pattern: '/labs',
          entrypoint: new URL('./pages/index.astro', import.meta.url),
        });
        injectRoute({
          pattern: '/labs/[...slug]',
          entrypoint: new URL('./pages/[...slug].astro', import.meta.url),
        });
        for (const extension of Object.keys(assetTypes)) {
          injectRoute({
            pattern: `/lab-artifacts/[...slug].${extension}`,
            entrypoint: new URL('./artifact-route.ts', import.meta.url),
            prerender: true,
          });
        }
      },
    },
  };
}
