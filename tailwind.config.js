/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        // A small example of what might be included in a custom theme
        extend: {
            colors: {
                'red-ish': {
                    100: '#ff0040',
                    200: '#f12000',
                    300: '#ff3202',
                    400: '#ff0220',
                    500: '#ff0120',
                },
            },
            fontSize: {
                xxs: '5rem',
            },
            fontFamily: {
                Inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
