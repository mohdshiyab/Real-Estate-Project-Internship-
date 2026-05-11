/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#0d4d3a",
          deep: "#063528",
          glow: "#11785b",
        },
        gold: {
          DEFAULT: "#c9a44c",
          light: "#e8c878",
          dark: "#9a7a2c",
        },
        ink: "#0a0f0d",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e8c878 0%, #c9a44c 50%, #9a7a2c 100%)",
        "emerald-gradient": "linear-gradient(135deg, #11785b 0%, #0d4d3a 60%, #063528 100%)",
        "hero-overlay":
          "linear-gradient(135deg, rgba(6,53,40,0.85) 0%, rgba(10,15,13,0.7) 60%, rgba(10,15,13,0.95) 100%)",
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(201,164,76,0.45)",
        emerald: "0 20px 50px -20px rgba(13,77,58,0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.7s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
