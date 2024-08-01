import type { Indexer } from '@storybook/types';
import { loadCsf } from '@storybook/csf-tools';
import { serverRequire } from '@storybook/core-common';
import { compileTailwindColors } from './compileTailwindConfig';
import { vite, webpack, TAILWIND_REGEX } from './unplugin';
import resolveConfig from 'tailwindcss/resolveConfig';

const logger = console;

const dynamicIndexer: Indexer = {
    test: TAILWIND_REGEX,
    createIndex: async (fileName, opts) => {
        logger.log('indexing', fileName);
        delete require.cache[fileName];
        const config = await serverRequire(fileName);
        const fullTailwindConfig = resolveConfig(config);
        const colors = fullTailwindConfig.theme.colors;
        const compiled = await compileTailwindColors(colors);
        const indexed = loadCsf(compiled, {
            ...opts,
            fileName,
        }).parse();
        const out = indexed.indexInputs[0];

        return [
            {
                type: 'docs',
                importPath: out.importPath,
                exportName: '__docs',
                name: 'Docs',
                title: out.title,
                metaId: undefined,
                tags: ['stories-mdx'],
                metaTags: ['stories-mdx'],
                __id: 'theme-colors--docs', // TODO: update when we have a better id.
                storiesImports: undefined, // not needed since we don't ref stories
            },
        ];
    },
};

export const experimental_indexers: Indexer[] = [dynamicIndexer];

export const viteFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(vite({}));
    config.plugins = plugins;
    return config;
};

export const webpackFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(webpack({}));
    config.plugins = plugins;
    return config;
};
