import resolveConfig = require('tailwindcss/resolveConfig');
import { Config } from 'tailwindcss/types/config';
import { compile as mdxCompile } from '@storybook/mdx2-csf';
import allColors from 'tailwindcss/colors';

/// TODO: Add ability to turn this off based off user input
const getSubtitle = (color: string): string => {
    // FIXME: Slightly naive check, but it should work for now
    const isDefaultColor = Object.keys(allColors).includes(color);
    const defaultColorMessage = 'Default color from Tailwind CSS';
    const customColorMessage = 'Custom color';
    return isDefaultColor ? defaultColorMessage : customColorMessage;
};
const fixMdx = (colors: Record<string, any>) => {

    const colorEntries = Object.entries(colors).map(([key, value]) => ({
        key,
        value,
        subtitle: getSubtitle(key),
    }));
    return `
import { Meta } from '@storybook/blocks';
import { ColorItem, ColorPalette } from "@storybook/blocks";

<Meta title="Theme/Colors" />
<ColorPalette>
    {${JSON.stringify(colorEntries)}.map(({ key, value, subtitle }) => (
      <ColorItem
        key={key}
        title={key}
        subtitle={subtitle}
        colors={value}
      />
    ))}
  </ColorPalette>
    `;
};

export const compileTailwindConfig = async (config: Config) => {
    const fullTailwindConfig = resolveConfig(config);
    const colors = fullTailwindConfig.theme.colors;
    const groupedColors = groupTailwindColors(colors);
    return await mdxCompile(fixMdx(groupedColors), {});
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
}