import { PresetValue, StorybookConfigRaw } from 'storybook/internal/types';
import { vite } from './unplugin';
import { configIndexer, cssIndexer } from './indexers';
import { ThemeLoaderManager } from './core/theme-loader';
import { AddonOptions } from './core/theme-transformer';
import { TailwindSectionInput, CustomSectionInput } from './types';

type PresetOptions = {
    defaultPath?: string;
    sections?: TailwindSectionInput[];
    forceSingleDoc?: CustomSectionInput;
    presets?: any;
};

function createAddonOptions(options: PresetOptions): AddonOptions {
    return new AddonOptions(
        options.defaultPath,
        options.sections,
        options.forceSingleDoc
    );
}

export async function experimental_indexers(
    existingIndexers: any[],
    options: PresetOptions
) {
    const addonOptions = createAddonOptions(options);
    return [
        ...existingIndexers,
        configIndexer(addonOptions),
        cssIndexer(addonOptions),
    ];
}

export const viteFinal = async (config: any, options: PresetOptions) => {
    const { plugins = [] } = config;
    const stories: PresetValue<StorybookConfigRaw['stories']> =
        await options.presets.apply('stories');
    const themeLoaderManager = new ThemeLoaderManager(stories);
    const themeLoader = themeLoaderManager.getLoader();

    if (themeLoader === null) return config;

    plugins.push(
        vite({
            themeLoader: themeLoader,
            addonOptions: createAddonOptions(options),
        })
    );
    config.plugins = plugins;
    return config;
};

// TODO: Webpack support
