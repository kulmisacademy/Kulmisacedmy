import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bce7ff",
          300: "#8ed9ff",
          400: "#59c2ff",
          500: "#33a6ff",
          600: "#1a87f5",
          700: "#136ee1",
          800: "#1658b6",
          900: "#194b8f",
        },
        accent: {
          pink: "#e91e8c",
          magenta: "#c2185b",
          teal: "#00bcd4",
          cyan: "#00acc1",
        },
      },
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "neon-glow": "neon-glow 3s ease-in-out infinite",
        "neon-border": "neon-border 4s linear infinite",
        "neon-shimmer": "neon-shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.9", filter: "brightness(1.15)" },
        },
        "neon-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(33, 166, 255, 0.5), 0 0 40px rgba(233, 30, 140, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(33, 166, 255, 0.7), 0 0 60px rgba(233, 30, 140, 0.5)" },
        },
        "neon-border": {
          "0%, 100%": { borderColor: "rgba(33, 166, 255, 0.8)", boxShadow: "0 0 15px rgba(33, 166, 255, 0.4)" },
          "33%": { borderColor: "rgba(0, 188, 212, 0.8)", boxShadow: "0 0 15px rgba(0, 188, 212, 0.4)" },
          "66%": { borderColor: "rgba(233, 30, 140, 0.8)", boxShadow: "0 0 15px rgba(233, 30, 140, 0.4)" },
        },
        "neon-shimmer": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #e0f7ff 0%, #ffffff 50%, #fff5f9 100%)",
        "gradient-text": "linear-gradient(90deg, #21a6ff, #00bcd4, #e91e8c)",
        "gradient-cta": "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
