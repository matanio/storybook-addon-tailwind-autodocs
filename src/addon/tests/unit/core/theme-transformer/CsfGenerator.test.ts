import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CsfGenerator } from '../../../../core/theme-transformer';
import { Color, AddonOptions } from '../../../../core/theme-transformer';

vi.mock('../../../../core/theme-transformer/AddonOptions');

describe('CsfGenerator', () => {
    let mockAddonOptions: AddonOptions;

    beforeEach(() => {
        mockAddonOptions = {
            sections: [
                { name: 'Colors', path: 'Theme/Colors' },
                { name: 'Typography', path: 'Theme/Typography' },
            ],
            singleDoc: undefined,
        } as AddonOptions;

        vi.mocked(AddonOptions).mockReturnValue(mockAddonOptions);
    });

    it('renders fallback message when colors are empty', () => {
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain(
            'No colors detected. To see a color, add it to your Tailwind configuration'
        );
    });

    it('renders ColorItem when colors are present', () => {
        const colors = [
            new Color('brandPrimary', { brandPrimary: '#ff0000' }),
            new Color('brandSecondary', { brandSecondary: '#0000ff' }),
        ];
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate(colors, {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain('ColorItem');
        expect(result).toContain('brandPrimary');
        expect(result).toContain('brandSecondary');
    });

    it('renders fallback message when typography is empty', () => {
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain(
            'No font families detected. To see typography, add a font family to your Tailwind configuration,'
        );
    });

    it('renders font families when typography is present', () => {
        const generator = new CsfGenerator(mockAddonOptions);
        const typography = {
            type: { sans: 'Helvetica, Arial', serif: 'Georgia, Times' },
            weight: { normal: '400', bold: '700' },
            size: { sm: '16px', lg: '32px' },
        };
        const result = generator.generate([], typography);
        expect(result).toContain('FontHeaderSection');
        expect(result).toContain('Helvetica, Arial');
        expect(result).toContain('Georgia, Times');
        expect(result).toContain('400');
        expect(result).toContain('700');
        expect(result).toContain('16px');
        expect(result).toContain('32px');
    });

    it('generates multi-story when singleDoc is not set', () => {
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain('export const Colors');
        expect(result).toContain('export const Typography');
    });

    it('generates single story when singleDoc is set', () => {
        mockAddonOptions.singleDoc = {
            name: 'All Theme',
            path: 'Theme/All Theme',
        };
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain('export const AllTheme');
        expect(result).not.toContain('export const Colors');
        expect(result).not.toContain('export const Typography');
    });

    it('includes HorizontalRule between sections in single story', () => {
        mockAddonOptions.singleDoc = {
            name: 'AllTheme',
            path: 'Theme/AllTheme',
        };
        const colors = [new Color('primary', { primary: '#ff0000' })];
        const typography = {
            type: { sans: 'Helvetica' },
            weight: { normal: '400' },
            size: { sm: '16px' },
        };
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate(colors, typography);
        expect(result).toContain('<HorizontalRule />');
    });

    it('does not include HorizontalRule after last section in single story', () => {
        mockAddonOptions.sections = [{ name: 'Colors', path: 'Theme/Colors' }];
        mockAddonOptions.singleDoc = {
            name: 'AllTheme',
            path: 'Theme/AllTheme',
        };
        const colors = [new Color('primary', { primary: '#ff0000' })];
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate(colors, {
            type: {},
            weight: {},
            size: {},
        });
        const hrCount = (result.match(/<HorizontalRule \/>/g) || []).length;
        expect(hrCount).toBe(0);
    });

    it('only generates enabled sections in multi-story', () => {
        mockAddonOptions.sections = [{ name: 'Colors', path: 'Theme/Colors' }];
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: {},
            weight: {},
            size: {},
        });
        expect(result).toContain('export const Colors');
        expect(result).not.toContain('export const Typography');
    });

    it('only generates enabled sections in single story', () => {
        mockAddonOptions.sections = [
            { name: 'Typography', path: 'Theme/Typography' },
        ];
        mockAddonOptions.singleDoc = {
            name: 'All Theme',
            path: 'Theme/All Theme',
        };
        const generator = new CsfGenerator(mockAddonOptions);
        const result = generator.generate([], {
            type: { sans: 'Helvetica' },
            weight: { normal: '400' },
            size: { sm: '16px' },
        });
        expect(result).toContain('export const AllTheme');
        expect(result).toContain('FontHeaderSection');
        expect(result).not.toContain('<ColorItem');
        expect(result).not.toContain('<Title>Colors</Title>');
    });
});
