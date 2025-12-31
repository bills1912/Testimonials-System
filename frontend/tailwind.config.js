/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic dark theme palette
        'void': {
          50: '#f5f5f7',
          100: '#e5e5ea',
          200: '#c7c7cc',
          300: '#aeaeb2',
          400: '#8e8e93',
          500: '#636366',
          600: '#48484a',
          700: '#3a3a3c',
          800: '#2c2c2e',
          900: '#1c1c1e',
          950: '#0a0a0c'
        },
        'cyber': {
          50: '#e6fffa',
          100: '#b2f5ea',
          200: '#81e6d9',
          300: '#4fd1c5',
          400: '#38b2ac',
          500: '#319795',
          600: '#2c7a7b',
          700: '#285e61',
          800: '#234e52',
          900: '#1d4044'
        },
        'neon': {
          cyan: '#00f0ff',
          magenta: '#ff00aa',
          purple: '#9d00ff',
          blue: '#0066ff',
          green: '#00ff88',
          yellow: '#ffee00',
          orange: '#ff6600',
          pink: '#ff0099'
        },
        'glass': {
          white: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.2)'
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
        'glow-gradient': 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(157, 0, 255, 0.15) 50%, rgba(255, 0, 170, 0.15) 100%)'
      },
      backgroundSize: {
        'grid': '50px 50px'
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.2), 0 0 60px rgba(0, 240, 255, 0.1)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.3), 0 0 40px rgba(157, 0, 255, 0.2), 0 0 60px rgba(157, 0, 255, 0.1)',
        'neon-magenta': '0 0 20px rgba(255, 0, 170, 0.3), 0 0 40px rgba(255, 0, 170, 0.2), 0 0 60px rgba(255, 0, 170, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card': '0 4px 24px -1px rgba(0, 0, 0, 0.3), 0 2px 8px -1px rgba(0, 0, 0, 0.2)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'scan': 'scan 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.5), 0 0 60px rgba(0, 240, 255, 0.3)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
