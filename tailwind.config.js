
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
          primary: '#222214',
          secondary: '#8C8C88',
          background: '#F5F5F4',
          accent: {
            DEFAULT: '#E8E8E4',
            active: '#E0E0DB',
          },
          camo: {
            DEFAULT: '#C2CBA8',
            accent: '#878E6B',
          },
          swamp: {
            DEFAULT: 'rgba(143, 143, 112, 1)',
            '10%': 'rgba(143, 143, 112, 0.1)',
            '10': 'rgba(239, 239, 236, 1)',
          },
          green: {
            DEFAULT: 'rgba(125, 136, 97, 1)',
            '10%': 'rgba(125, 136, 97, 0.1)',
            '10': 'rgba(233, 234, 229, 1)',
          },
          purple: {
            DEFAULT: 'rgba(118, 120, 158, 1)',
            '10%': 'rgba(118, 120, 158, 0.1)',
            '10': '#E8E8EB',
          },
          orange: {
            DEFAULT: 'rgba(178, 134, 52, 1)',
            '10%': 'rgba(178, 134, 52, 0.1)',
            '10': 'rgba(238, 234, 225, 1)',
          },
        },
        tremor: {
          brand: {
            faint: "#fafaf9", // stone-50
            muted: "#e7e5e4", // stone-200
            subtle: "#78716c", // stone-500
            DEFAULT: "#292524", // stone-800
            emphasis: "#1c1917", // stone-900
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#fafaf9", // stone-50
            subtle: "#f5f5f4", // stone-100
            DEFAULT: "#ffffff", // white
            emphasis: "#44403c", // stone-700
          },
          border: {
            DEFAULT: "#e7e5e4", // stone-200
          },
          ring: {
            DEFAULT: "#e7e5e4", // stone-200
          },
          content: {
            subtle: "#a8a29e", // stone-400
            DEFAULT: "#78716c", // stone-500
            emphasis: "#44403c", // stone-700
            strong: "#1c1917", // stone-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0c0a09", // stone-950
            muted: "#1c1917", // stone-900
            subtle: "#292524", // stone-800
            DEFAULT: "#78716c", // stone-500
            emphasis: "#a8a29e", // stone-400
            inverted: "#0c0a09", // stone-950
          },
          background: {
            muted: "#1c1917", // stone-900
            subtle: "#292524", // stone-800
            DEFAULT: "#1c1917", // stone-900
            emphasis: "#d6d3d1", // stone-300
          },
          border: {
            DEFAULT: "#292524", // stone-800
          },
          ring: {
            DEFAULT: "#292524", // stone-800
          },
          content: {
            subtle: "#57534e", // stone-600
            DEFAULT: "#57534e", // stone-600
            emphasis: "#e7e5e4", // stone-200
            strong: "#fafaf9", // stone-50
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
      },
      borderRadius: {
        "tremor-small": "0.25rem",
        "tremor-default": "0.375rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        xxs: ['10px', '12px'],
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
        // didn't namespace 'marketing' beacause it wouldn't compile for some reason
        'marketing-xs': ['12px', { lineHeight: '16px', letterSpacing: '-0.02em' }],
        'marketing-sm': ['15px', { lineHeight: '20px', letterSpacing: '-0.02em' }],
        'marketing-base': ['19px', { lineHeight: '24px', letterSpacing: '-0.025em' }],
        'marketing-md': ['24px', { lineHeight: '28px', letterSpacing: '-0.025em' }],
        'marketing-lg': ['30px', { lineHeight: '32px', letterSpacing: '-0.025em' }],
        'marketing-xl': ['37px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
        'marketing-2xl': ['46px', { lineHeight: '44px', letterSpacing: '-0.035em' }],
        'marketing-3xl': ['58px', { lineHeight: '52px', letterSpacing: '-0.035em' }],
        'marketing-4xl': ['72px', { lineHeight: '64px', letterSpacing: '-0.045em' }],
        'marketing-5xl': ['91px', { lineHeight: '80px', letterSpacing: '-0.045em' }],
      },
      width: {
        1536: "1536px",
      },
      maxWidth: {
        xxs: '300px'
      },
      height: {
        150: "37.5rem",
      },
      margin: {
        30: "7.5rem",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica", ...fontFamily.sans],
        default: ["var(--font-inter)", ...fontFamily.sans],
        cal: ["var(--font-cal)", ...fontFamily.sans],
        geist: ["var(--font-geist)", ...fontFamily.sans],
        title: ["var(--font-title)", ...fontFamily.sans],
        mono: ["Consolas", ...fontFamily.mono],
        'geist-mono': ["var(--font-geist-mono)", ...fontFamily.mono],
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
      },
      animation: {
        wiggle: "wiggle 0.8s both",
      },
      screens: {
        "xs": "425px",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:stone|slate|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:stone|slate|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:stone|slate|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:sstone|late|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:stone|slate|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:stone|slate|gray|zinc|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require('flowbite/plugin'),
  ],
};
