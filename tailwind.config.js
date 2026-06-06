/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0b10",
          card: "#12131a",
          border: "#1f2230",
          primary: "#10b981", // Matrix green
          accent: "#06b6d4",  // Hacker cyan
          danger: "#ef4444",  // Alert red
          warning: "#f59e0b", // Warning yellow
          purple: "#8b5cf6",  // Specialization purple
          text: "#e2e8f0",    // Soft slate text
          muted: "#64748b"    // Muted slate text
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}