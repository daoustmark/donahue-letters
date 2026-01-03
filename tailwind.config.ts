import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm sepia tones for vintage letter aesthetic
        sepia: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f3dbc2',
          300: '#eac69e',
          400: '#dfab77',
          500: '#d4915a',
          600: '#c67a4c',
          700: '#a56141',
          800: '#854f3a',
          900: '#6c4232',
        },
        // Military olive drab
        olive: {
          50: '#f6f7f4',
          100: '#e3e6dc',
          200: '#c7cdba',
          300: '#a5af91',
          400: '#86936f',
          500: '#6b7856',
          600: '#545f44',
          700: '#434b37',
          800: '#383e2f',
          900: '#303529',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: '#374151',
            lineHeight: '1.8',
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
