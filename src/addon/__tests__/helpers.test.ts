import { describe, expect, it } from 'vitest';
import {
    extractFontSizes,
    getFontFamiliesAsStrings,
    getPxValue,
    getSubtitle,
    getTypography,
    groupTailwindColors,
} from '../helpers';
import allColors from 'tailwindcss/colors';

describe('getFontFamiliesAsStrings', () => {
    it('should convert font families to strings correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica', 'Arial'],
            serif: ['Georgia', 'Times'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica, Arial',
            serif: 'Georgia, Times',
        });
    });

    it('should convert empty arrays to empty string', () => {
        const fontFamilies: Record<string, string[]> = {
            sans: [],
            serif: [],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: '',
            serif: '',
        });
    });

    it('should handle single font family correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica'],
            serif: ['Georgia'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica',
            serif: 'Georgia',
        });
    });

    it('should handle multiple font families correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica', 'Arial', 'Verdana'],
            serif: ['Georgia', 'Times', 'Courier'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica, Arial, Verdana',
            serif: 'Georgia, Times, Courier',
        });
    });

    it('should handle spaces in font family names correctly', () => {
        const fontFamilies = {
            sans: ['Helvetica Neue', 'Arial Black'],
            serif: ['Times New Roman', 'Courier New'],
        };
        const result = getFontFamiliesAsStrings(fontFamilies);
        expect(result).toEqual({
            sans: 'Helvetica Neue, Arial Black',
            serif: 'Times New Roman, Courier New',
        });
    });
});

describe('getSubtitle', () => {
    it('should return "Default color from Tailwind CSS" for default Tailwind colors', () => {
        const colorLabel = 'red';
        const values = allColors.red;
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Default color from Tailwind CSS');
    });

    it('should return "Custom color" for non-default colors', () => {
        const colorLabel = 'customRed';
        const values = { 500: '#ff0000' };
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });

    it('should return "Custom color" for colors not in Tailwind CSS', () => {
        const colorLabel = 'nonExistentColor';
        const values = { 500: '#123456' };
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });

    it('should handle empty values correctly', () => {
        const colorLabel = 'red';
        const values = {};
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });

    it('should return "Custom color" for extended Tailwind colors', () => {
        const colorLabel = 'red';
        const values = { ...allColors.red, 600: '#ff6666' }; // Extending the red color
        const result = getSubtitle(colorLabel, values);
        expect(result).toBe('Custom color');
    });
});

describe('getPxValue', () => {
    it('should convert rem to px correctly', () => {
        expect(getPxValue('1rem')).toBe('16px');
        expect(getPxValue('0.875rem')).toBe('14px');
    });

    it('should convert em to px correctly', () => {
        expect(getPxValue('1em')).toBe('16px');
        expect(getPxValue('0.875em')).toBe('14px');
    });

    it('should convert pt to px correctly', () => {
        expect(getPxValue('1pt')).toBe('1.3333px');
        expect(getPxValue('12pt')).toBe('16px');
    });

    it('should convert cm to px correctly', () => {
        expect(getPxValue('1cm')).toBe('37.7953px');
        expect(getPxValue('0.5cm')).toBe('18.8976px');
    });

    it('should convert mm to px correctly', () => {
        expect(getPxValue('1mm')).toBe('3.7795px');
        expect(getPxValue('10mm')).toBe('37.7953px');
    });

    it('should convert in to px correctly', () => {
        expect(getPxValue('1in')).toBe('96px');
        expect(getPxValue('0.5in')).toBe('48px');
    });

    it('should convert pc to px correctly', () => {
        expect(getPxValue('1pc')).toBe('16px');
        expect(getPxValue('2pc')).toBe('32px');
    });

    it('should convert % to px correctly', () => {
        expect(getPxValue('100%')).toBe('16px');
        expect(getPxValue('50%')).toBe('8px');
    });

    it('should convert 0rem to 0px', () => {
        expect(getPxValue('0rem')).toBe('0px');
    });

    it('should convert negative rem values correctly', () => {
        expect(getPxValue('-1rem')).toBe('-16px');
    });

    it('should convert fractional rem values correctly', () => {
        expect(getPxValue('0.5rem')).toBe('8px');
        expect(getPxValue('1.5rem')).toBe('24px');
    });

    it('should throw an error for invalid size format', () => {
        expect(() => getPxValue('invalid')).toThrow(
            'Invalid size format: invalid'
        );
        expect(() => getPxValue('16')).toThrow('Invalid size format: 16');
    });

    it('should throw an error for unsupported units', () => {
        expect(() => getPxValue('1vw')).toThrow('Unsupported unit: vw');
        expect(() => getPxValue('1inch')).toThrow('Unsupported unit: inch');
    });

    it('should handle empty string correctly', () => {
        expect(() => getPxValue('')).toThrow('Invalid size format: ');
    });
});

describe('extractFontSizes', () => {
    it('should extract and sort font sizes correctly', () => {
        const fontSizes = { sm: '0.875rem', lg: '1.25rem', md: '1rem' };
        const result = extractFontSizes(fontSizes);
        expect(result).toEqual({ sm: '14px', md: '16px', lg: '20px' });
    });

    it('should handle array font sizes correctly', () => {
        const fontSizes = { sm: ['0.875rem'], lg: ['1.25rem', '1.5rem'] };
        const result = extractFontSizes(fontSizes);
        expect(result).toEqual({ sm: '14px', lg: '20px' });
    });

    it('should handle font sizes with default line heights correctly', () => {
        const fontSizes = { sm: ['14px', '20px'], lg: ['20px', '28px'] };
        const result = extractFontSizes(fontSizes);
        expect(result).toEqual({ sm: '14px', lg: '20px' });
    });

    it('should handle font sizes with additional properties correctly', () => {
        const fontSizes = {
            '2xl': [
                '1.5rem',
                {
                    lineHeight: '2rem',
                    letterSpacing: '-0.01em',
                    fontWeight: '500',
                },
            ],
            '3xl': [
                '1.875rem',
                {
                    lineHeight: '2.25rem',
                    letterSpacing: '-0.02em',
                    fontWeight: '700',
                },
            ],
        };
        const result = extractFontSizes(fontSizes);
        expect(result).toEqual({ '2xl': '24px', '3xl': '30px' });
    });
});

describe('getTypography', () => {
    it('should correctly extract and convert font sizes', () => {
        const fontSizes = { sm: '0.875rem', lg: '1.25rem' };
        const fontWeights = { normal: '400', bold: '700' };
        const fontFamilies = { sans: ['Helvetica', 'Arial'] };
        const result = getTypography(fontSizes, fontWeights, fontFamilies);
        expect(result.size).toEqual({ sm: '14px', lg: '20px' });
    });

    it('should correctly convert font families to strings', () => {
        const fontSizes = { sm: '0.875rem' };
        const fontWeights = { normal: '400' };
        const fontFamilies = {
            sans: ['Helvetica', 'Arial'],
            serif: ['Georgia', 'Times'],
        };
        const result = getTypography(fontSizes, fontWeights, fontFamilies);
        expect(result.type).toEqual({
            sans: 'Helvetica, Arial',
            serif: 'Georgia, Times',
        });
    });

    it('should correctly return the typography object', () => {
        const fontSizes = { sm: '0.875rem' };
        const fontWeights = { normal: '400' };
        const fontFamilies = { sans: ['Helvetica', 'Arial'] };
        const result = getTypography(fontSizes, fontWeights, fontFamilies);
        expect(result).toEqual({
            type: { sans: 'Helvetica, Arial' },
            weight: { normal: '400' },
            size: { sm: '14px' },
        });
    });
});

describe('groupTailwindColors', () => {
    it('should group colors where all values are strings', () => {
        const colors = { red: '#ff0000', blue: '#0000ff' };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            { key: 'red', value: { red: '#ff0000' }, subtitle: 'Custom color' },
            {
                key: 'blue',
                value: { blue: '#0000ff' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should group colors where some values are objects', () => {
        const colors = { red: { 500: '#ff0000' }, blue: '#0000ff' };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            { key: 'red', value: { 500: '#ff0000' }, subtitle: 'Custom color' },
            {
                key: 'blue',
                value: { blue: '#0000ff' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should group colors with a mix of strings and objects', () => {
        const colors = {
            red: { 500: '#ff0000' },
            blue: '#0000ff',
            green: { 300: '#00ff00' },
        };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            { key: 'red', value: { 500: '#ff0000' }, subtitle: 'Custom color' },
            {
                key: 'blue',
                value: { blue: '#0000ff' },
                subtitle: 'Custom color',
            },
            {
                key: 'green',
                value: { 300: '#00ff00' },
                subtitle: 'Custom color',
            },
        ]);
    });

    it('should correctly set the subtitle for default and custom colors', () => {
        const twReds = {
            '50': '#fef2f2',
            '100': '#fee2e2',
            '200': '#fecaca',
            '300': '#fca5a5',
            '400': '#f87171',
            '500': '#ef4444',
            '600': '#dc2626',
            '700': '#b91c1c',
            '800': '#991b1b',
            '900': '#7f1d1d',
            '950': '#450a0a',
        };
        const colors = { red: twReds, customColor: '#123456' };
        const result = groupTailwindColors(colors);
        expect(result).toEqual([
            {
                key: 'red',
                value: twReds,
                subtitle: 'Default color from Tailwind CSS',
            },
            {
                key: 'customColor',
                value: { customColor: '#123456' },
                subtitle: 'Custom color',
            },
        ]);
    });
});
