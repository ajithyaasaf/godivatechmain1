/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

// Static theme config for Vercel without dynamic file reading
// This ensures we don't rely on file system operations during build
const themeConfig = {
  // Default primary color matches theme.json
  '--primary': '220 85% 45%',
  
  // Static colors that match our existing theme
  '--border': '240 5.9% 90%',
  '--input': '240 5.9% 90%',
  '--ring': '240 5.9% 10%',
  '--background': '0 0% 100%',
  '--foreground': '240 10% 3.9%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '240 4.8% 95.9%',
  '--secondary-foreground': '240 5.9% 10%',
  '--muted': '240 4.8% 95.9%',
  '--muted-foreground': '240 3.8% 46.1%',
  '--accent': '240 4.8% 95.9%',
  '--accent-foreground': '240 5.9% 10%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '0 0% 98%',
  '--radius': '0.75rem',
};

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    typography,
    function({ addBase }) {
      addBase({
        ':root': themeConfig,
      })
    }
  ],
}