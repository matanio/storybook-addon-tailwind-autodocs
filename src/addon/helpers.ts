import allColors from 'tailwindcss/colors';

export const TAILWIND_BASE_RATIO = 16;
/**
 * Group the colors from the resolved Tailwind CSS configuration.
 *
 * If a color is a string, it is wrapped in an object with the same key.
 * If a color is an object, it is left as is.
 * @param colors
 */
export const groupTailwindColors = (colors: Record<string, any>) => {
    const groupedColors: Record<string, Record<string, string>> = {};
    for (const key in colors) {
        const value = colors[key];
        if (typeof value === 'object') {
            groupedColors[key] = value;
        } else {
            groupedColors[key] = { [key]: value };
        }
    }
    // Tranform into an array of objects with key, value, and subtitle
    return Object.entries(groupedColors).map(([key, value]) => ({
        key,
        value,
        subtitle: getSubtitle(key),
    }));
};

export interface Typography {
    type: Record<string, string>;
    weight: Record<string, string>;
    size: Record<string, string>;
}

export const getTypography = (
    fontSizes: Record<string, any>,
    fontWeights: Record<string, any>,
    fontFamilies: Record<string, any>
): Typography => {
    const extractedFontSizes = extractFontSizes(fontSizes);
    const fontFamilyStrings = getFontFamiliesAsStrings(fontFamilies);
    return {
        type: fontFamilyStrings,
        weight: fontWeights,
        size: extractedFontSizes,
    };
};

/**
 * Extract the font sizes from the resolved Tailwind CSS configuration.
 * @param fontSizes
 */
const extractFontSizes = (
    fontSizes: Record<string, any>
): Record<string, string> => {
    const extractedFontSizes: Record<string, string> = {};
    for (const key in fontSizes) {
        if (Array.isArray(fontSizes[key])) {
            extractedFontSizes[key] = convertRemToPx(fontSizes[key][0]);
        } else {
            extractedFontSizes[key] = convertRemToPx(fontSizes[key]);
        }
    }

    // Sort the extracted font sizes by their pixel values
    const sortedFontSizes = Object.entries(extractedFontSizes).sort(
        ([, sizeA], [, sizeB]) => parseFloat(sizeA) - parseFloat(sizeB)
    );

    // Convert back to an object
    const sortedFontSizesObj: Record<string, string> = {};
    for (const [key, value] of sortedFontSizes) {
        sortedFontSizesObj[key] = value;
    }

    return sortedFontSizesObj;
};

const convertRemToPx = (rem: string): string => {
    return `${parseFloat(rem) * TAILWIND_BASE_RATIO}px`;
};

export const getFontFamiliesAsStrings = (
    fontFamilies: Record<string, string[]>
): Record<string, string> => {
    const fontFamiliesAsStrings: Record<string, string> = {};
    for (const key in fontFamilies) {
        fontFamiliesAsStrings[key] = fontFamilies[key].join(', ');
    }
    return fontFamiliesAsStrings;
};

// TODO: Add ability to turn this off based off user input
export const getSubtitle = (
    colorLabel: string,
    values: Record<string, string>
): string => {
    const defaultColorMessage = 'Default color from Tailwind CSS';
    const customColorMessage = 'Custom color';

    if (!allColors.hasOwnProperty(colorLabel)) {
        return customColorMessage;
    }

    // FIXME: TS error
    const tailwindColors = allColors[colorLabel];

    const isDefaultColor =
        JSON.stringify(tailwindColors) === JSON.stringify(values);

    return isDefaultColor ? defaultColorMessage : customColorMessage;
};
