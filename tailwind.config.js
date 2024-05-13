/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        fontFamily: {
            sans: ['Arial', 'sans-serif'],
        },
        extend: {
            fontFamily: {
                RobotoSlab: ['var(--roboto-slab)', 'sans-serif'],
            },
            letterSpacing: {
                '-6': '-0.06em',
                '-1': '-0.01em',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                subtext: 'var(--subtext)',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    white: '#fff',
                    skyBlue: 'var(--sky-blue)',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
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
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                background: {
                    seasalt: 'var(--seasalt)',
                    aliceBlue: 'var(--alice-blue)',
                },
            },
            fontSize: {
                h2: ['44px', '48px'],
                h3: ['28px', '40px'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
