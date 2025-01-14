const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  theme: {
    extend: {
      colors: {
        // light mode
        marketing: {
          primary: "#222214",
          secondary: "#8C8C88",
          background: "#F5F5F4",
          accent: {
            DEFAULT: "#E8E8E4",
            active: "#E0E0DB",
          },
          camo: {
            DEFAULT: "#C2CBA8",
            accent: "#878E6B",
          },
          swamp: {
            DEFAULT: "rgba(143, 143, 112, 1)",
            "10%": "rgba(143, 143, 112, 0.1)",
            10: "rgba(239, 239, 236, 1)",
          },
          green: {
            DEFAULT: "rgba(125, 136, 97, 1)",
            "10%": "rgba(125, 136, 97, 0.1)",
            10: "rgba(233, 234, 229, 1)",
          },
          purple: {
            DEFAULT: "rgba(118, 120, 158, 1)",
            "10%": "rgba(118, 120, 158, 0.1)",
            10: "#E8E8EB",
          },
          orange: {
            DEFAULT: "rgba(178, 134, 52, 1)",
            "10%": "rgba(178, 134, 52, 0.1)",
            10: "rgba(238, 234, 225, 1)",
          },
        },
        tremor: {
          brand: {
            faint: "#F9FAFB", // gray-50
            muted: "#E5E7EB", // gray-200
            subtle: "#6B7280", // gray-500
            DEFAULT: "#374151", // gray-800
            emphasis: "#1F2937", // gray-900
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#f9fafb", // gray-50
            subtle: "#f3f4f6", // gray-100
            DEFAULT: "#ffffff", // white
            emphasis: "#374151", // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          ring: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          content: {
            subtle: "#9ca3af", // gray-400
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#374151", // gray-700
            strong: "#111827", // gray-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#172554", // blue-950
            subtle: "#1e40af", // blue-800
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#60a5fa", // blue-400
            inverted: "#030712", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1f2937", // gray-800
            DEFAULT: "#111827", // gray-900
            emphasis: "#d1d5db", // gray-300
          },
          border: {
            DEFAULT: "#1f2937", // gray-800
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
          content: {
            subtle: "#4b5563", // gray-600
            DEFAULT: "#6b7280", // gray-600
            emphasis: "#e5e7eb", // gray-200
            strong: "#f9fafb", // gray-50
            inverted: "#000000", // black
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        'border-sm': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.05',
        'border': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'border-md': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'border-lg': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'border-xl': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'border-b': '0 1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        "tremor-small": "0.25rem",
        "tremor-default": "0.375rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        xxs: ["11px", "12px"],
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
        // didn't namespace 'marketing' beacause it wouldn't compile for some reason
        "marketing-xs": [
          "12px",
          { lineHeight: "16px", letterSpacing: "-0.02em" },
        ],
        "marketing-sm": [
          "16px",
          { lineHeight: "24px", letterSpacing: "-0.02em" },
        ],
        "marketing-base": [
          "20px",
          { lineHeight: "28px", letterSpacing: "-0.025em" },
        ],
        "marketing-md": [
          "24px",
          { lineHeight: "28px", letterSpacing: "-0.025em" },
        ],
        "marketing-lg": [
          "30px",
          { lineHeight: "32px", letterSpacing: "-0.025em" },
        ],
        "marketing-xl": [
          "37px",
          { lineHeight: "40px", letterSpacing: "-0.03em" },
        ],
        "marketing-2xl": [
          "46px",
          { lineHeight: "48px", letterSpacing: "-0.03em" },
        ],
        "marketing-3xl": [
          "58px",
          { lineHeight: "52px", letterSpacing: "-0.035em" },
        ],
        "marketing-4xl": [
          "72px",
          { lineHeight: "64px", letterSpacing: "-0.045em" },
        ],
        "marketing-5xl": [
          "91px",
          { lineHeight: "80px", letterSpacing: "-0.045em" },
        ],
      },
      width: {
        1536: "1536px",
      },
      maxWidth: {
        xxs: "300px",
      },
      height: {
        150: "37.5rem",
      },
      margin: {
        30: "7.5rem",
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "HelveticaNeue-Light",
          "Helvetica Neue Light",
          "Helvetica",
          ...fontFamily.sans,
        ],
        default: ["var(--font-inter)", ...fontFamily.sans],
        cal: ["var(--font-cal)", ...fontFamily.sans],
        geist: ["var(--font-geist)", ...fontFamily.sans],
        title: ["var(--font-title)", ...fontFamily.sans],
        mono: ["Consolas", ...fontFamily.mono],
        "geist-mono": ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: "Cal Sans",
            },
            h2: {
              fontFamily: "Cal Sans",
            },
            h3: {
              fontFamily: "Cal Sans",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-6px) rotate(-6deg)" },
          "30%": { transform: "translateX(9px) rotate(6deg)" },
          "45%": { transform: "translateX(-9px) rotate(-3.6deg)" },
          "60%": { transform: "translateX(3px) rotate(2.4deg)" },
          "75%": { transform: "translateX(-2px) rotate(-1.2deg)" },
        },
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.8s both",
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      screens: {
        xs: "425px",
      },
      letterSpacing: {
        tightish: "-0.0125em",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("flowbite/plugin"),
  ],
};
