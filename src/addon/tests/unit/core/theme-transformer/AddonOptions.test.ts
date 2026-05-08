import { describe, expect, it } from 'vitest';
import { AddonOptions } from '../../../../core/theme-transformer';

describe('AddonOptions', () => {
    describe('validation', () => {
        it('throws for empty defaultPath', () => {
            expect(() => new AddonOptions('', ['Colors'])).toThrow(
                'defaultPath must be a non-empty string'
            );
        });

        it('throws for whitespace defaultPath', () => {
            expect(() => new AddonOptions('   ', ['Colors'])).toThrow(
                'defaultPath must be a non-empty string'
            );
        });

        it('throws for non-array sections', () => {
            expect(() => new AddonOptions('Base/', null as any)).toThrow(
                'sections must be an array'
            );
        });

        it("doesn't throw for empty sections array", () => {
            expect(() => new AddonOptions('Base/', [])).not.toThrow();
        });

        it('throws for invalid section string', () => {
            expect(() => new AddonOptions('Base/', ['InvalidSection'])).toThrow(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        });

        it('throws for invalid section object name', () => {
            const invalidSection = { name: 'InvalidSection', path: 'Path' };
            expect(() => new AddonOptions('Base/', [invalidSection])).toThrow(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        });

        it('throws for empty section.path', () => {
            const invalidSection = { name: 'Colors', path: '' };
            expect(() => new AddonOptions('Base/', [invalidSection])).toThrow(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        });

        it('throws for whitespace-only section.path', () => {
            const invalidSection = { name: 'Colors', path: '   ' };
            expect(() => new AddonOptions('Base/', [invalidSection])).toThrow(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        });

        it('throws for non-string section.path', () => {
            const invalidSection = { name: 'Colors', path: 123 as any };
            expect(() => new AddonOptions('Base/', [invalidSection])).toThrow(
                'Invalid section: must be a valid tailwind section string or name and optional path'
            );
        });

        it('throws for invalid singleDoc object', () => {
            expect(
                () =>
                    new AddonOptions('Base/', ['Colors'], {
                        name: 'Colors',
                        path: '',
                    })
            ).toThrow(
                'Invalid single doc: must be a valid string or name and optional path'
            );
        });

        it('accepts valid singleDoc object', () => {
            expect(
                () =>
                    new AddonOptions('Base/', ['Colors'], {
                        name: 'Colors',
                        path: 'Base/Colors',
                    })
            ).not.toThrow();
        });

        it('accepts valid singleDoc string', () => {
            expect(
                () => new AddonOptions('Base/', ['Colors'], 'Colors')
            ).not.toThrow();
        });

        it('throws for empty singleDoc string', () => {
            expect(() => new AddonOptions('Base/', ['Colors'], '')).toThrow(
                'Invalid single doc: must be a valid string or name and optional path'
            );
        });

        it('throws for whitespace singleDoc string', () => {
            expect(() => new AddonOptions('Base/', ['Colors'], '   ')).toThrow(
                'Invalid single doc: must be a valid string or name and optional path'
            );
        });
    });

    describe('normalization', () => {
        it('creates with default parameters and normalizes section paths', () => {
            const options = new AddonOptions();
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Tailwind Theme/Colors' },
                { name: 'Typography', path: 'Tailwind Theme/Typography' },
            ]);
        });

        it('normalizes section string with custom defaultPath', () => {
            const options = new AddonOptions('Custom/', ['Colors']);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Custom/Colors' },
            ]);
        });

        it('uses provided path in section object', () => {
            const sectionObj = { name: 'Typography', path: 'Some Path' };
            const options = new AddonOptions('Base/', [sectionObj]);
            expect(options.sections).toEqual([sectionObj]);
        });

        it('concatenates defaultPath and name if path ends with slash', () => {
            const sectionObj = { name: 'Colors', path: 'Base/' };
            const options = new AddonOptions('Base/', [sectionObj]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Base/Colors' },
            ]);
        });

        it('does not concatenate if path does not end with slash', () => {
            const sectionObj = { name: 'Colors', path: 'Base/Custom' };
            const options = new AddonOptions('Base/', [sectionObj]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Base/Custom' },
            ]);
        });

        it('normalizes multiple mixed section inputs', () => {
            const options = new AddonOptions('Theme/', [
                'Colors',
                { name: 'Typography', path: 'Theme/' },
                { name: 'Colors', path: 'Theme/Custom' },
            ]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Theme/Colors' },
                { name: 'Typography', path: 'Theme/Typography' },
                { name: 'Colors', path: 'Theme/Custom' },
            ]);
        });

        it('handles defaultPath without trailing slash', () => {
            const options = new AddonOptions('Theme', ['Colors']);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Theme' },
            ]);
        });

        it('handles section object with undefined path', () => {
            const options = new AddonOptions('Base/', [{ name: 'Colors' }]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Base/Colors' },
            ]);
        });

        it("replaces section.path '/' with the section name", () => {
            const sectionObj = { name: 'Colors', path: '/' };
            const options = new AddonOptions('Base/', [sectionObj]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Colors' },
            ]);
        });

        it("uses name when defaultPath is '/' for string section entries", () => {
            const options = new AddonOptions('/', ['Colors']);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Colors' },
            ]);
        });

        it("uses name when defaultPath is '/' for object entries without path", () => {
            const options = new AddonOptions('/', [{ name: 'Typography' }]);
            expect(options.sections).toEqual([
                { name: 'Typography', path: 'Typography' },
            ]);
        });

        it('mixed inputs with defaultPath "/" and explicit "/" paths', () => {
            const options = new AddonOptions('/', [
                'Colors',
                { name: 'Typography', path: '/' },
            ]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Colors' },
                { name: 'Typography', path: 'Typography' },
            ]);
        });

        it('handles duplicate section names', () => {
            const options = new AddonOptions('Base/', [
                'Colors',
                { name: 'Colors', path: 'Base/Custom' },
            ]);
            expect(options.sections).toEqual([
                { name: 'Colors', path: 'Base/Colors' },
                { name: 'Colors', path: 'Base/Custom' },
            ]);
        });

        it('handles empty sections array', () => {
            const options = new AddonOptions('Base/', []);
            expect(options.sections).toEqual([]);
        });
    });

    describe('singleDoc', () => {
        it('sets singleDoc when provided as object', () => {
            const override = { name: 'Colors', path: 'MyPath' };
            const options = new AddonOptions('Base/', ['Colors'], override);
            expect(options.singleDoc).toEqual(override);
        });

        it('sets singleDoc when provided as string', () => {
            const options = new AddonOptions('Base/', ['Colors'], 'Colors');
            expect(options.singleDoc).toEqual({
                name: 'Colors',
                path: 'Base/Colors',
            });
        });

        it('normalizes singleDoc with path ending slash', () => {
            const override = { name: 'Colors', path: 'Base/' };
            const options = new AddonOptions('Base/', ['Colors'], override);
            expect(options.singleDoc).toEqual({
                name: 'Colors',
                path: 'Base/Colors',
            });
        });

        it('normalizes singleDoc with path "/"', () => {
            const override = { name: 'Colors', path: '/' };
            const options = new AddonOptions('Base/', ['Colors'], override);
            expect(options.singleDoc).toEqual({
                name: 'Colors',
                path: 'Colors',
            });
        });

        it('singleDoc is undefined when not provided', () => {
            const options = new AddonOptions('Base/', ['Colors']);
            expect(options.singleDoc).toBeUndefined();
        });
    });
});
