import { createUnplugin } from 'unplugin';
import { serverRequire } from '@storybook/core-common';
import { getCsfFromConfig } from './compile';
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
            const fontSizes = fullTailwindConfig.theme.fontSize;
            const fontWeights = fullTailwindConfig.theme.fontWeight;
            const fontFamilies = fullTailwindConfig.theme.fontFamily;
            return await getCsfFromConfig(
                colors,
                fontSizes,
                fontWeights,
                fontFamilies
            );
        },
    };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
