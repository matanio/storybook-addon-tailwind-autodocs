import { TAILWIND_BASE_RATIO, Typography } from './helpers';

export const generateThemeMdx = (
    colors: Record<string, any>,
    typography: Typography
) => {
    const fontSizes = Object.values(typography.size);
    const fontWeights = Object.entries(typography.weight);
    const formattedFontWeights = fontWeights.map(([label, weightValue]) => {
        return `${weightValue}(${label})`;
    });
    const fontFamilies = Object.entries(typography.type);

    const SampleText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    return `
import { Meta } from '@storybook/blocks';
import { ColorItem, ColorPalette, Title, Subtitle, Typeset } from "@storybook/blocks";

<Meta title="Theme" />
<Title>Theme</Title>
<Subtitle>This is the auto-generated theme from your <pre style={{display: 'inline', fontSize: '18px'}}>tailwind.config.js</pre> file.</Subtitle>
 ${'{'}
<details>
<summary style={{fontFamily: 'Nunito Sans', fontSize: '20px', marginBottom: '1rem', fontWeight: '700'}}>Colors</summary>
<ColorPalette>
    {${JSON.stringify(colors)}.map(({ key, value, subtitle }) => (
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

 ${'{'}
<details>
<summary style={{fontFamily: 'Nunito Sans', fontSize: '20px', marginBottom: '1rem', fontWeight: '700'}}>Typography</summary>
<div style={{marginBottom: '1rem', fontFamily: 'Nunito Sans'}}>
<i>Note: 1rem = ${TAILWIND_BASE_RATIO}px</i>
</div>

{${JSON.stringify(fontFamilies)}.map(([label, fontFamily]) => (
    <details>
    <summary style={{fontFamily: fontFamily, fontSize: '18px', marginBottom: '1rem', marginLeft: '1rem', fontWeight: '500', textTransform: 'capitalize'}}>{label}</summary>
    <div style={{marginLeft: '1rem'}}>
        <b>Weights:</b> ${formattedFontWeights.join(', ')}
        <Typeset 
            fontSizes={${JSON.stringify(fontSizes)}}
            fontWeight={400}
            sampleText={\`${SampleText}\`}
            fontFamily={fontFamily}
        />
    </div>
    </details>
    
))}
</details>
${'}'}
`;
};
