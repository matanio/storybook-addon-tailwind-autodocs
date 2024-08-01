import { createUnplugin } from 'unplugin';
import { serverRequire } from '@storybook/core-common';
import { compileTailwindColors } from './compileTailwindConfig';
import resolveConfig from 'tailwindcss/resolveConfig';

export const TAILWIND_REGEX = /tailwind\.config\.[jt]s/;

export const unplugin = createUnplugin(() => {
    return {
        name: 'unplugin-tailwind-autodocs',
        enforce: 'pre',
        loadInclude(id) {
            return TAILWIND_REGEX.test(id);
        },
        async load(fileName) {
            delete require.cache[fileName];
            const config = await serverRequire(fileName);
            const fullTailwindConfig = resolveConfig(config);
            const colors = fullTailwindConfig.theme.colors;
            return await compileTailwindColors(colors);
        },
    };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
