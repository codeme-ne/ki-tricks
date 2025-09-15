import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        // Responsive typography sizes using clamp()
        'heading-1': ['clamp(2.25rem, 6vw, 3rem)', { lineHeight: '1.25', letterSpacing: '-0.025em', fontWeight: '700' }],
        'heading-2': ['clamp(1.875rem, 5vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.025em', fontWeight: '700' }],
        'heading-3': ['clamp(1.5rem, 4vw, 1.875rem)', { lineHeight: '1.375', letterSpacing: '-0.025em', fontWeight: '600' }],
        'heading-4': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.375', letterSpacing: '0', fontWeight: '600' }],
        'body-large': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.625', letterSpacing: '0', fontWeight: '400' }],
        'body-default': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-small': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'card-title': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.375', letterSpacing: '-0.025em', fontWeight: '600' }],
        'card-meta': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'ui-label': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(1rem)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'spin-slow': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-slow': 'pulse-slow 2.5s infinite',
      },
      zIndex: {
        '0': '0',
        '10': '10',  // Dropdowns, tooltips
        '20': '20',  // Mobile menu overlay and content
        '30': '30',  // Fixed header
        '40': '40',  // Modal backdrops
        '50': '50',  // Modals, toast notifications
      },
    },
  },
  plugins: [],
}

export default config