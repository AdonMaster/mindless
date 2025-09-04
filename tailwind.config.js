module.exports = {
    // Use the 'content' key to specify where Tailwind should scan for classes
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    safelist: [
        'bg-primary/20',
        'bg-success/20',
    ],
    theme: {
        extend: {
            // Your custom theme extensions
        },
    },
    plugins: [],
};