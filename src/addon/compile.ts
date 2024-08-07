import { compile } from '@storybook/mdx2-csf';
import { generateThemeMdx } from './mdx';
import { getTypography, groupTailwindColors } from './helpers';

export const getCsfFromConfig = async (
    tailwindConfigColors: Record<string, any>,
    tailwindFontSizes: Record<string, any>,
    tailwindFontWeights: Record<string, any>,
    tailwindFontFamilies: Record<string, any>
) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    const typography = getTypography(
        tailwindFontSizes,
        tailwindFontWeights,
        tailwindFontFamilies
    );
    const themeMdx = generateThemeMdx(groupedColors, typography);
    return await compile(themeMdx, {});
};
