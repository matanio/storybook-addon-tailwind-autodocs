import { describe, expect, it } from 'vitest';
import { getFontFamiliesAsStrings } from '../helpers';

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
