import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js', flowbite.content()],
    theme: {
        extend: {
            colors: {
                'background-primary': '#191824',
                'background-secondary': "#1e1f2f",
                'background-secondary-hover': "#1a1b28",
                'background-channel-hover': "#262739",
                'danger': '#dc2626',
                'danger-hover': '#b91c1c',
                'link': '#3b82f6',
                'link-hover': '#2563eb'
            },
        },
    },
    plugins: [flowbite.plugin()],
};
