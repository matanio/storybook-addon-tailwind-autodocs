import { ThemeLoader } from './ThemeLoader';
import {
    TAILWIND_CSS_REGEX,
    TAILWIND_IMPORT_REGEX,
    VIRTUAL_FILE_PREFIX,
} from '../../../constants';
import { ResolvedConfig, ThemeCssVariables } from '../../../types';
import { readFileSync } from 'fs';
import { ThemeCssParser } from '../parsers';
import { deepMerge } from '../../../util';

export class CssLoader extends ThemeLoader {
    public matchingRegex: RegExp = TAILWIND_CSS_REGEX;
    private parser: typeof ThemeCssParser;

    constructor(parser: typeof ThemeCssParser = ThemeCssParser) {
        super();
        this.parser = parser;
    }

    public isVersionSupported(version: number): boolean {
        return version >= 4;
    }

    public supportedVersionLabel(): string {
        return 'v4+';
    }

    public baseResolveId(filePath: string): string | null {
        if (!this.isRegexMatch(filePath)) return null;
        try {
            const content = readFileSync(filePath, 'utf-8');
            if (!TAILWIND_IMPORT_REGEX.test(content)) return null;
            return VIRTUAL_FILE_PREFIX + filePath;
        } catch {
            return null;
        }
    }

    public getTailwindTheme(filePath: string): Promise<ResolvedConfig> {
        const cssContent = readFileSync(filePath, 'utf-8');
        const parsedTheme = this.parser.parseTheme(cssContent);
        const defaultTheme = require('tailwindcss/defaultTheme');
        const baseColors =
            typeof defaultTheme.colors === 'function'
                ? defaultTheme.colors()
                : defaultTheme.colors || {};

        const mapped = this.mapThemeVariablesToTailwind(parsedTheme.variables);

        // If global overriden, ignore all defaults; just use mapped values
        if (parsedTheme.isDefaultOverridden()) {
            return Promise.resolve({
                theme: {
                    colors: mapped.colors,
                    fontFamily: mapped.fontFamily,
                    fontWeight: mapped.fontWeight,
                    fontSize: mapped.fontSize,
                },
            });
        } else {
            return Promise.resolve({
                theme: {
                    colors: parsedTheme.isDefaultOverridden('color')
                        ? mapped.colors
                        : deepMerge(baseColors, mapped.colors),
                    fontFamily: parsedTheme.isDefaultOverridden('font')
                        ? mapped.fontFamily
                        : deepMerge(
                              defaultTheme.fontFamily || {},
                              mapped.fontFamily
                          ),
                    fontWeight: parsedTheme.isDefaultOverridden('font-weight')
                        ? mapped.fontWeight
                        : deepMerge(
                              defaultTheme.fontWeight || {},
                              mapped.fontWeight
                          ),
                    fontSize: parsedTheme.isDefaultOverridden('text')
                        ? mapped.fontSize
                        : deepMerge(
                              defaultTheme.fontSize || {},
                              mapped.fontSize
                          ),
                },
            });
        }
    }

    private mapThemeVariablesToTailwind(variables: ThemeCssVariables) {
        return {
            colors: this.groupColorVariables(
                this.filterResetKeys(variables['color'] || {})
            ),
            fontFamily: this.filterResetKeys(variables['font'] || {}),
            fontWeight: this.filterResetKeys(variables['font-weight'] || {}),
            fontSize: this.filterResetKeys(variables['text'] || {}),
            // Add more mappings as needed
        };
    }

    private filterResetKeys(obj: Record<string, any>): Record<string, any> {
        const filtered: Record<string, any> = {};
        for (const key in obj) {
            if (key !== '*') filtered[key] = obj[key];
        }
        return filtered;
    }

    // Groups flat color keys into nested objects
    private groupColorVariables(
        flatColors: Record<string, string | string[]>
    ): Record<string, any> {
        const grouped: Record<string, any> = {};
        for (const key in flatColors) {
            const match = /^([a-zA-Z0-9\-]+)-(\d{2,3})$/.exec(key);
            if (match) {
                const group = match[1];
                const shade = match[2];
                if (!grouped[group]) grouped[group] = {};
                grouped[group][shade] = flatColors[key];
            } else {
                grouped[key] = flatColors[key];
            }
        }
        return grouped;
    }

}
