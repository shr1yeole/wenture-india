import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wenture: {
          dark: "#0A192A",
          darker: "#060F1A",
          navy: "#0E2439",
          blue: "#00A6E8",
          blueHover: "#0093CE",
          blueLight: "#38BDF8",
          cyanLight: "#DFF6FD",
          cyanMuted: "#EBF8FD",
          bg: "#F7FAFC",
          cardBg: "#FFFFFF",
          muted: "#64748B",
          border: "#E2E8F0",
          borderDark: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(0, 166, 232, 0.35)",
        "glow-lg": "0 0 60px -15px rgba(0, 166, 232, 0.45)",
        "glow-sm": "0 0 20px -5px rgba(0, 166, 232, 0.25)",
        card: "0 10px 30px -5px rgba(10, 25, 42, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)",
        "card-hover": "0 20px 40px -10px rgba(10, 25, 42, 0.1), 0 0 0 1px rgba(0, 166, 232, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 2s infinite",
        "shimmer": "shimmer 3s linear infinite",
        "beam": "beam 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        beam: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.98)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
