/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          "pulse-slow": "pulse 1.5s ease-in-out infinite",
        },
        keyframes: {
          pulse: {
            "0%, 100%": { transform: "scaleY(1)" },
            "50%": { transform: "scaleY(0.4)" },
          },
        },
        animationDelay: {
          100: "100ms",
          200: "200ms",
          300: "300ms",
          400: "400ms",
        },
        // Add the new color palette based on #971BB2
        colors: {
          "voice-purple": {
            200: "#e0a8f0", // Lighter shade for text
            400: "#c057d8", // Mid-tone for soundwave
            500: "#971BB2", // Main color (#971BB2)
            600: "#7d1694", // Darker shade for hover effects
            700: "#631276", // Even darker for shadows
          },
        },
      },
    },
    plugins: [],
  };