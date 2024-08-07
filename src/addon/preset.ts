import type { Indexer, IndexInput } from '@storybook/types';
import { TAILWIND_REGEX, vite, webpack } from './unplugin';

const logger = console;

const dynamicIndexer: Indexer = {
    test: TAILWIND_REGEX,
    createIndex: async () => {
        return [
            {
                type: 'docs',
                exportName: '__docs',
                name: 'Docs',
                title: 'Theme',
                tags: ['autodocs'],
            } as IndexInput,
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
