import resolveConfig = require('tailwindcss/resolveConfig');
import { Config } from 'tailwindcss/types/config';
import { compile as mdxCompile } from '@storybook/mdx2-csf';

const fixMdx = (colors: Record<string, any>) => `
import { Meta } from '@storybook/blocks';
import { ColorItem, ColorPalette } from "@storybook/blocks";

<Meta title="Theme/Test/Hello" />
<ColorPalette>
    {Object.entries(${JSON.stringify(colors)}).map(([key, value]) => (
      <ColorItem
        key={key}
        title={'theme.colors.' + key}
        subtitle={'Subtitle here'} // Ensure subtitle is defined
        colors={value}
      />
    ))}
  </ColorPalette>
`;

export const compile = async (config: Config) => {
    // TODO: Fix non-object vals in Colors
    const fullConfig = resolveConfig(config);
    const colors = fullConfig.theme.colors;
    return await mdxCompile(fixMdx(colors), {});
};
