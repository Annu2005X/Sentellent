/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#4285F4',
                'background-light': '#f8f9fa',
                'background-dark': '#0f1419',
                'card-dark': '#1a1f26',
                'border-dark': '#2d3748',
                'text-muted': '#9ca3af',
            },
            fontFamily: {
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
