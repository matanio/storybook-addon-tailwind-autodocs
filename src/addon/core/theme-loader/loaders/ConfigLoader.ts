import { ThemeLoader } from './ThemeLoader';
import { TAILWIND_CONFIG_REGEX, VIRTUAL_FILE_PREFIX } from '../../../constants';
import { ResolvedConfig } from '../../../types';
import { serverRequire } from 'storybook/internal/common';

export class ConfigLoader extends ThemeLoader {
    public matchingRegex: RegExp = TAILWIND_CONFIG_REGEX;

    public isVersionSupported(version: number): boolean {
        return version === 3;
    }

    public supportedVersionLabel(): string {
        return 'v3';
    }

    public baseResolveId(filePath: string): string | null {
        if (this.isRegexMatch(filePath)) {
            return VIRTUAL_FILE_PREFIX + filePath;
        }
        return null;
    }

    public async getTailwindTheme(filePath: string): Promise<ResolvedConfig> {
        const resolveConfig = require('tailwindcss/resolveConfig');
        const config = await serverRequire(filePath);
        const resolvedConfig = resolveConfig(config);

        return {
            theme: {
                colors: resolvedConfig.theme.colors,
                fontSize: resolvedConfig.theme.fontSize,
                fontFamily: resolvedConfig.theme.fontFamily,
                fontWeight: resolvedConfig.theme.fontWeight,
            },
        };
    }
}
