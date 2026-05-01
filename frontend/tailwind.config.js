/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark theme colors
        background: {
          DEFAULT: '#0a0e1a',
          light: '#111827',
          lighter: '#1f2937'
        },
        // Neon accent colors
        primary: {
          DEFAULT: '#8b5cf6', // Purple neon
          dark: '#7c3aed',
          light: '#a78bfa'
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyan neon
          dark: '#0891b2',
          light: '#22d3ee'
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399'
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24'
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          light: '#f87171'
        },
        // Text colors
        text: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
          muted: '#6b7280'
        },
        // Glass card
        glass: {
          DEFAULT: 'rgba(17, 24, 39, 0.7)',
          light: 'rgba(31, 41, 55, 0.5)',
          border: 'rgba(255, 255, 255, 0.1)'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 12px 48px rgba(139, 92, 246, 0.2)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      }
    },
  },
  plugins: [],
}
