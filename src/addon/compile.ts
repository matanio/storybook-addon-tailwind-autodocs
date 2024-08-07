import { compile } from '@storybook/mdx2-csf';
import { generateThemeMdx } from './mdx';

export const getCsfFromConfig = async (
    tailwindConfigColors: Record<string, any>
) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    const themeMdx = generateThemeMdx(groupedColors);
    return await compile(themeMdx, {});
};

/**
 * Group the colors from the resolved Tailwind CSS configuration.
 *
 * If a color is a string, it is wrapped in an object with the same key.
 * If a color is an object, it is left as is.
 * @param colors
 */
const groupTailwindColors = (colors: Record<string, any>) => {
    const groupedColors: Record<string, Record<string, string>> = {};
    for (const key in colors) {
        const value = colors[key];
        if (typeof value === 'object') {
            groupedColors[key] = value;
        } else {
            groupedColors[key] = { [key]: value };
        }
    }
    return groupedColors;
};
