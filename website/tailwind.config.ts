import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './comps/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        primary: {
          "primary": "#d79a61",
          "secondary": "#af6731",
          "accent": "#5865f2",
          "base-100": "#262424",  
          "base-200": "#1c1a1a",  
          "base-300": "#0c0b0b",  
          "neutral": "#403d3d",
          "info": "#43b7fb",
          "success": "#00980d",                 
          "warning": "#fbe843",
          "error": "#fb4343",
          "gold": "#f7c02c"
        }
      }
    ],
  },
}
export default config
