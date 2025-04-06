
import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      borderWidth: {
        '6': '6px',
      },
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
        poppins: ["Poppins", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "car-blue": "#1677FF", // Updated royal blue
        "car-orange": "#FF8800", // Electric orange
        "car-green": "#00C853", // Tech green
        "car-red": "#ea384c",
        "neon-green": "#39FF14",
        "teal-accent": "#00BFA5",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "rotate-car": {
          "0%": {
            transform: "rotateY(0deg)"
          },
          "100%": {
            transform: "rotateY(360deg)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        },
        "pulse-ring": {
          "0%": {
            transform: "scale(0.8)",
            opacity: "0.8"
          },
          "50%": {
            opacity: "0.4"
          },
          "100%": {
            transform: "scale(1.2)",
            opacity: "0"
          }
        },
        "scan-line": {
          "0%": {
            top: "0%"
          },
          "100%": {
            top: "100%"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "rotate-car": "rotate-car 10s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "scan-line": "scan-line 2s linear infinite"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'tech-pattern': "url('/tech-pattern.svg')",
        'hero-gradient': 'linear-gradient(90deg, #1677FF 0%, #00BFA5 100%)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".cursor-emoji": {
          cursor: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🔍</text></svg>\") 5 5, auto",
        },
        ".glassmorphism": {
          "@apply bg-white/10 backdrop-blur-md border border-white/20 shadow-lg": {},
        },
        ".dark-glassmorphism": {
          "@apply bg-black/40 backdrop-blur-md border border-white/10 shadow-lg": {},
        },
      });
    }),
  ],
};

export default config;
