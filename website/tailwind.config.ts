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
          "base-100": "#0e0d0d",    
          "base-200": "#070606",    
          "info": "#43b7fb",
          "success": "#4ffb43",                 
          "warning": "#fbe843",
          "error": "#fb4343",
          "gold": "#f7c02c"
        }
      }
    ],
  },
}
export default config
