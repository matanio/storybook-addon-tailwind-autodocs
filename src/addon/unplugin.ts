import { createUnplugin } from 'unplugin';
import { serverRequire } from '@storybook/core-common';
import { compileTailwindConfig } from './compileTailwindConfig';

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
            return await compileTailwindConfig(config);
        },
    };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
