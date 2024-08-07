import allColors from 'tailwindcss/colors';

export const generateThemeMdx = (colors: Record<string, any>) => {
    const colorEntries = Object.entries(colors).map(([key, value]) => ({
        key,
        value,
        subtitle: getSubtitle(key),
    }));
    return `
import { Meta } from '@storybook/blocks';
import { ColorItem, ColorPalette, Title, Subtitle } from "@storybook/blocks";

<Meta title="Theme" />
<Title>Theme</Title>
<Subtitle>This is the auto-generated theme from your <pre style={{display: 'inline', fontSize: '18px'}}>tailwind.config.js</pre> file.</Subtitle>
 ${'{'}
<details>
<summary style={{fontFamily: 'Nunito Sans', fontSize: '20px', marginBottom: '1rem', fontWeight: '700'}}>Colors</summary>
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
</details>
${'}'}
`;
};

// TODO: Add ability to turn this off based off user input
export const getSubtitle = (color: string): string => {
    // FIXME: Slightly naive check, but it should work for now
    const isDefaultColor = Object.keys(allColors).includes(color);
    const defaultColorMessage = 'Default color from Tailwind CSS';
    const customColorMessage = 'Custom color';
    return isDefaultColor ? defaultColorMessage : customColorMessage;
};
