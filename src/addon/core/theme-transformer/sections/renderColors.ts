import { Color } from '../Color';

export function renderColors(colors: Color[]): string {
    const hasColors = colors.length > 0;
    return `
        <Title>Colors</Title>
        <br />
        ${
            hasColors
                ? `
        <ColorPalette>
            {${JSON.stringify(colors)}.map((color) => (
                <ColorItem
                    key={color.baseName}
                    title={color.baseName}
                    subtitle={color.subtitle}
                    colors={color.shades}
                />
            ))}
        </ColorPalette>
        `
                : `
        <NoneDetectedText>
            No colors detected. To see a color, add it to your Tailwind configuration, or ensure Tailwind's defaults are not being overridden.
        </NoneDetectedText>
        `
        }
        `;
}
