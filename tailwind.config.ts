import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Poppins'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        // Theraklick brand colors from logo
        brand: {
          teal: "#2A9D8F",
          "teal-light": "#3DB4A5",
          "teal-dark": "#21867A",
          yellow: "#F4B942",
          "yellow-light": "#F7CA6B",
          "yellow-dark": "#D9A033",
          white: "#FFFFFF",
          cream: "#FEFCF3",
        },
        // Extended palette
        tk: {
          50: "#F0FDF9",
          100: "#CCFBEF",
          200: "#9AF5E1",
          300: "#5FE9CE",
          400: "#2DD4B8",
          500: "#2A9D8F",
          600: "#21867A",
          700: "#1A6B62",
          800: "#14524C",
          900: "#0F3D39",
          950: "#082320",
        },
        sun: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F4B942",
          500: "#D9A033",
          600: "#B8860B",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
        },
        // Dark theme colors
        dark: {
          900: "#0C1821",
          800: "#1B2838",
          700: "#2C3E50",
          600: "#34495E",
        },
        primary: {
          DEFAULT: "#2A9D8F",
          50: "#F0FDF9",
          100: "#CCFBEF",
          200: "#9AF5E1",
          300: "#5FE9CE",
          400: "#2DD4B8",
          500: "#2A9D8F",
          600: "#21867A",
          700: "#1A6B62",
          800: "#14524C",
          900: "#0F3D39",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
