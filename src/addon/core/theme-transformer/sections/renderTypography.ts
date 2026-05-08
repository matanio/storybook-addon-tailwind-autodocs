import { Typography } from '../../../types';

export function renderTypography(typography: Typography): string {
    const fontSizes = Object.values(typography.size);
    const fontWeights = Object.entries(typography.weight);
    const fontFamilies = Object.entries(typography.type);
    const sampleText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const hasFontFamily = fontFamilies.length > 0;

    return `
        <Title>Typography</Title>
        <br />
        ${
            hasFontFamily
                ? `
        {${JSON.stringify(fontFamilies)}.map(([label, fontFamily], familyIndex) => (
            <div key={label}>
                <FontHeaderSection>
                    <div>
                        <b>Font Face: </b>
                        <span style={{ fontFamily }}>{label}</span>
                    </div>
                    <div>
                        <b>Weights: </b>
                        {${JSON.stringify(fontWeights)}.map(([weightLabel, weightValue], index) => (
                            <span key={weightLabel} style={{ fontWeight: weightValue, fontFamily }}>
                                {\`\${weightValue}(\${weightLabel})\${index < ${fontWeights.length} - 1 ? ', ' : ''}\`}
                            </span>
                        ))}
                    </div>
                </FontHeaderSection>
                <Typeset
                    fontSizes={${JSON.stringify(fontSizes)}}
                    fontWeight={400}
                    sampleText="${sampleText}"
                    fontFamily={fontFamily}
                />
                {familyIndex < ${fontFamilies.length} - 1 && <HorizontalRule />}
            </div>
        ))}
        `
                : `
        <NoneDetectedText>
            No font families detected. To see typography, add a font family to your Tailwind configuration, or ensure Tailwind's defaults are not being overridden.
        </NoneDetectedText>
        `
        }
        `;
}
