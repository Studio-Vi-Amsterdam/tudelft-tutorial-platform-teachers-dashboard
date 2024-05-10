/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,tsx}',
        './components/**/*.{js,tsx}',
        '.src/app/**/*.{js,tsx}',
        './src/**/*.{js,tsx}',
    ],
    prefix: '',
    theme: {
        fontFamily: {
            sans: ['Arial', 'sans-serif'],
        },
        extend: {
            letterSpacing: {
                '-6': '-0.06em',
                '-1': '-0.01em',
            },
            colors: {
                primary: {
                    DEFAULT: 'var(--primary)',
                    white: '#fff',
                    skyBlue: 'var(--sky-blue)',
                },
                secondary: {
                    navy: 'var(--navy)',
                    cornYellow: 'var(--corn-yellow)',
                    palatinatePurple: 'var(--palatinate-purple)',
                    jungleGreen: 'var(--jungle-green)',
                },
                tertiary: {
                    skyBlue: {
                        10: 'var(--sky-blue-10)',
                        20: 'var(--sky-blue-20)',
                    },
                    jungleGreen: 'var(--jungle-green-10)',
                    cornYellow: 'var(--corn-yellow-10)',
                    navy: 'var(--navy-40)',
                    grey: {
                        dim: 'var(--dim-grey)',
                        stone: 'var(--stone-grey)',
                        silver: 'var(--silver-grey)',
                    },
                },
                background: {
                    seasalt: 'var(--seasalt)',
                    aliceBlue: 'var(--alice-blue)',
                },
            },
        },
    },
};
