import { Color } from './Color';
import { Typography } from '../../types';
import { AddonOptions } from './AddonOptions';
import { sanitizeExportName } from '../../util';
import { renderColors, renderTypography } from './sections';

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
        import { useGlobals } from 'storybook/preview-api';

        export default {
            title: 'Theme',
            parameters: {
                layout: 'fullscreen',
                options: { bottomPanelHeight: 0 }
            },
            decorators: [
                (Story) => {
                    const [globals] = useGlobals();
                    const isDark = globals['darkMode'] === true || globals['theme'] === 'dark';
                    return (
                        <ThemeProvider theme={ensure(isDark ? themes.dark : themes.light)}>
                            <Story />
                        </ThemeProvider>
                    );
                }
            ]
        };

        const Wrapper = styled.div(({ theme }) => ({
          background: theme.background.content,
          color: theme.color.defaultText,
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
            minWidth: '0px',
            overflowX: 'auto',
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

        const CustomBadge = styled.span(({ theme }) => ({
            display: 'inline-block',
            fontSize: '10px',
            fontFamily: theme.typography.fonts.base,
            fontWeight: theme.typography.weight.bold,
            color: theme.color.secondary,
            border: \`1px solid \${theme.color.secondary}\`,
            borderRadius: '3px',
            padding: '1px 5px',
            marginLeft: '8px',
            verticalAlign: 'middle',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
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
                    ${renderColors(colors)}
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
                    ${renderTypography(typography)}
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
                elements.push(renderColors(colors));
            }
            if (section === 'Typography') {
                elements.push(renderTypography(typography));
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

}
