import { describe, expect, it } from 'vitest';
import { getFontFamiliesAsStrings, getSubtitle } from '../helpers';
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
