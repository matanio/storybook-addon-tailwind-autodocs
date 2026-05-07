# Tailwind Autodocs

This README is for understanding the addon and how it works. For usage instructions, see the main README at the repository root.

## Overview

This addon automatically generates Storybook documentation pages for your Tailwind CSS theme by extracting colors and typography from your Tailwind configuration — whether defined via [`tailwind.config.js|ts`](https://v3.tailwindcss.com/docs/configuration) (v3) or [CSS](https://tailwindcss.com/docs/theme) (v4).

## How It Works

The addon uses Storybook's [Indexer API](https://storybook.js.org/docs/api/main-config/main-config-indexers) to dynamically generate stories. As stated in Storybook's documentation, there are two key parts to generating stories from a non-CSF source:

1. **Creating sidebar entries** – Generates URLs that appear in the sidebar
2. **Rendering story content** – Creates the actual content displayed when a user navigates to those URLs

Everything in this project is built to support these two core functions.

### 1. Indexer Setup

The addon uses two indexers to watch for Tailwind configuration changes:

- **`configIndexer`**: Watches `tailwind.config.*` files (v3)
- **`cssIndexer`**: Watches CSS files containing the `@theme` directive (v4)

#### How Indexing Works

When configuration files change:

1. The indexer reads the file and any [options passed to the addon](https://storybook.js.org/docs/api/main-config/main-config-addons)
2. Generates index entries based on these options, with custom titles for sidebar organization
3. Storybook populates these entries into the sidebar

The indexers are registered in `preset.ts` via the `experimental_indexers` API.

### 2. Generate CSF via Unplugin

Storybook's documentation recommends generating CSF through a builder plugin. This is implemented using the [presets API](https://storybook.js.org/docs/addons/writing-presets#ui-configuration) with unplugin.

#### Generation Flow

1. **Determine loader**: Choose between v3 or v4 loader based on file type (`.css` vs `tailwind.config.js|ts`). The `TailwindPackageVersionDetector` logs recommendations based on the installed Tailwind version.

2. **Configure plugin**: The plugin:
    - Resolves configuration to a virtual module
    - Loads the theme using `ConfigLoader` (v3) or `CssLoader` (v4)
    - Transforms theme data to CSF using `ThemeTransformer`


## Development

This repository is set up for local development and testing:

- `src/addon` contains addon code
- Everything else can be treated as a normal project (e.g., add React components or stories to `src/stories`)

To develop locally:

```bash
npm run start
```

This will:
- Build the addon with `--watch` flag
- Run and restart Storybook on each build change


## Testing

Tests mirror the source structure within the `tests` folder.

Run tests with:

```bash
npm test
```

## Future Work

- Add integration and e2e tests (if valuable)
- Add more Tailwind sections (screens, spacing, borderRadius, etc.)