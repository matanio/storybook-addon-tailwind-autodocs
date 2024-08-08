# Tailwind Autodocs 🎨

Design system documentation that comes directly from your tailwind config.

Demo: _Coming Soon!_ 🚀

## Features

- Automatically generates documentation from `tailwind.config.js`
- Works with Hot Module Reloading (HMR); so changes to your tailwind config are reflected in the storybook immediately
- Displays the theme colors and typography using Storybook's doc blocks

_...and more features that are hopefully coming soon:_

- _Adding autodocs for tailwind spacing and screen break points_
- _Splitting up the documentation into separate tabs/entries_

## Requirements
- Storybook
- TailwindCSS

## Installation

First, install the package.

```sh
npm install --save-dev storybook-addon-tailwind-autodocs
```

Then, register it as an addon in `.storybook/main.js`, and specify your `tailwind.config.js` path there too.

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
    stories: [
    // ...
        '../tailwind.config.js', // 👈 replace with your tailwind configs path
    ],
// ...
    addons: [
        '@storybook/addon-essentials'
    '   storybook-addon-tailwind-autodocs', // 👈 register the addon here
    ],
};

export default config;
```

Then, run storybook with `npm run storybook`

And there you go! You should now see a new tab in your storybook called "Theme". 🎉