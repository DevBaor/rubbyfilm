import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cinema: {
          950: "#0F0F0F", // StreamVibe deepest container bg
          900: "#141414", // StreamVibe page background
          850: "#1A1A1A", // StreamVibe card/surface bg
          800: "#1F1F1F", // StreamVibe elevated surface
          750: "#222222",
          700: "#262626", // StreamVibe signature border
          600: "#333333", // hover border
          500: "#4D4D4D",
          400: "#9CA3AF", // Light-medium gray (metadata, secondary labels)
          300: "#D1D5DB", // Light gray (descriptions, synopses, menu items - chống mỏi mắt)
          200: "#F3F4F6", // Ivory white secondary
          100: "#F9FAFB", // Ivory white primary headings (trắng ngà, tuyệt đối không dùng #FFFFFF)
        },
        brand: {
          DEFAULT: "#E50000", // StreamVibe Signature Red Accent
          hover: "#FF1A1A",
          glow: "rgba(229, 0, 0, 0.35)",
          dark: "#B30000",
          light: "#FF4D4D",
        },
        stream: {
          bg: "#141414",
          surface: "#1A1A1A",
          dark: "#0F0F0F",
          border: "#262626",
          red: "#E50000",
          text: "#F9FAFB",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-be-vietnam-pro)",
          "'Be Vietnam Pro'",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        heading: [
          "var(--font-space-grotesk)",
          "var(--font-be-vietnam-pro)",
          "'Space Grotesk'",
          "sans-serif",
        ],
      },
      aspectRatio: {
        poster: "2 / 3",
        backdrop: "16 / 9",
      },
      boxShadow: {
        cinema: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
        "cinema-glow": "0 0 25px -5px rgba(229, 169, 60, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
