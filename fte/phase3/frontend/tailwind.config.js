/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          900: "#0c4a6e",
        },
        neon: {
          cyan: "#00f5ff",
          purple: "#bf00ff",
          pink: "#ff006e",
          green: "#00ff88",
          yellow: "#ffee00",
        },
        "neon-yellow": "#ffee00",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px #00f5ff, 0 0 40px #00f5ff44",
        "neon-purple": "0 0 20px #bf00ff, 0 0 40px #bf00ff44",
        "neon-pink": "0 0 20px #ff006e, 0 0 40px #ff006e44",
        "neon-green": "0 0 20px #00ff88, 0 0 40px #00ff8844",
        "glow-sm": "0 0 10px currentColor",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,245,255,0.15), transparent)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px #00f5ff, 0 0 20px #00f5ff" },
          "100%": { textShadow: "0 0 20px #bf00ff, 0 0 40px #bf00ff" },
        },
      },
    },
  },
  plugins: [],
};
