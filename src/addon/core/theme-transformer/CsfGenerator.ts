import { Color } from './Color';
import { Typography } from '../../types';
import { AddonOptions } from './AddonOptions';
import { sanitizeExportName } from '../../util';

export class CsfGenerator {
    private addonOptions: AddonOptions;

    constructor(addonOptions: AddonOptions) {
        this.addonOptions = addonOptions;
    }

    private getEnabledSections() {
        return this.addonOptions.sections.map(section => section.name);
    }

    public generate(colors: Color[], typography: Typography): string {
        if (this.addonOptions.forceSingleDoc !== undefined) {
            return this.generateSingleStory(
                colors,
                typography,
                sanitizeExportName(this.addonOptions.forceSingleDoc.name)
            );
        }
        return this.generateMultiStory(colors, typography);
    }

    private generateCommonCode(): string {
        return `
        import { styled, ThemeProvider, themes, ensure } from 'storybook/theming';
        import { ColorPalette, ColorItem, Typeset } from '@storybook/addon-docs/blocks';

        export default {
            title: 'Theme',
            parameters: {
                layout: 'fullscreen',
                options: { bottomPanelHeight: 0 }
            },
            decorators: [
                (Story) => (
                    <ThemeProvider theme={ensure(themes.light)}>
                        <Story />
                    </ThemeProvider>
                )
            ]
        };

        const Wrapper = styled.div(({ theme }) => ({
          background: theme.background.content,
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          padding: '4rem 20px',
          minHeight: '100vh',
          boxSizing: 'border-box',
          gap: '3rem',
          [\`@media (min-width: 600px)\`]: {}
        }));

        const Container = styled.div(() => ({
            maxWidth: '1000px',
            width: '100%',
            minWidth: '0px'
        }));

        // Inspired by https://github.com/storybookjs/storybook/blob/main/code/addons/docs/src/blocks/components/DocsPage.tsx
        // Basically what the toGlobalSelector('h1') renders
        const Title = styled.h1(({ theme }) => ({
            fontFamily: theme.typography.fonts.base,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
            WebkitOverflowScrolling: 'touch',
            margin: '20px 0 8px',
            padding: 0,
            cursor: 'text',
            position: 'relative',
            color: theme.color.defaultText,
            '&:first-of-type': {
              marginTop: 0,
              paddingTop: 0
            },
            '&:hover a.anchor': {
              textDecoration: 'none'
            },
            '& code': {
              fontSize: 'inherit'
            },
            fontSize: \`\${theme.typography.size.l1}px\`,
            fontWeight: theme.typography.weight.bold,
        }));

        const NoneDetectedText = styled.div(({ theme }) => ({
            color: theme.color.defaultText,
            fontStyle: 'italic',
            fontFamily: theme.typography.fonts.base,
            fontSize: theme.typography.size.s2,
            lineHeight: '24px',
            margin: '0',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
            WebkitOverflowScrolling: 'touch',
        }));

        const HorizontalRule = styled.div(({ theme }) => ({
              border: '0 none',
              borderTop: \`1px solid \${theme.appBorderColor}\`,
              height: 4,
              paddingBottom: '30px',
        }));

        const FontHeaderSection = styled.div(({ theme }) => ({
            fontFamily: theme.typography.fonts.base,
            fontSize: \`\${theme.typography.size.s3}px\`,
            color: theme.color.defaultText,
            margin: 0,
            padding: 0,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
            WebkitOverflowScrolling: 'touch',
        }));
        `;
    }

    private generateMultiStory(
        colors: Color[],
        typography: Typography
    ): string {
        const enabledSections = this.getEnabledSections();

        return `
    ${this.generateCommonCode()}
    ${
        enabledSections.includes('Colors')
            ? `
    export const Colors = {
        render: () => (
            <Wrapper>
                <Container>
                    ${this.renderColors(colors)}
                </Container>
            </Wrapper>
        )
    };
    `
            : ''
    }
    ${
        enabledSections.includes('Typography')
            ? `
    export const Typography = {
        render: () => (
            <Wrapper>
                <Container>
                    ${this.renderTypography(typography)}
                </Container>
            </Wrapper>
        )
    };
    `
            : ''
    }
    `;
    }

    private generateSingleStory(
        colors: Color[],
        typography: Typography,
        singleExportName: string
    ): string {
        const enabledSections = this.getEnabledSections();
        const elements: string[] = [];
        enabledSections.forEach((section, idx) => {
            if (section === 'Colors') {
                elements.push(this.renderColors(colors));
            }
            if (section === 'Typography') {
                elements.push(this.renderTypography(typography));
            }
            if (idx < enabledSections.length - 1) {
                elements.push('<HorizontalRule />');
            }
        });
        return `
        ${this.generateCommonCode()}
        export const ${singleExportName} = {
            render: () => (
                <Wrapper>
                    <Container>
                        ${elements.join('\n')}
                    </Container>
                </Wrapper>
            )
        };
        `;
    }

    private renderColors(colors: Color[]): string {
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

    private renderTypography(typography: Typography): string {
        const fontSizes = Object.values(typography.size);
        const fontWeights = Object.entries(typography.weight);
        const fontFamilies = Object.entries(typography.type);
        const sampleText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const hasFontFamily = fontFamilies.length > 0; // TODO: Update this handling so that it handles just weight and/or just size

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
}
