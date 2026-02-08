/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* === FONDATION SOMBRE === */
        'slate-950': '#020617',
        'navy': '#0f172a',
        'navy-light': '#1e293b',
        'navy-medium': '#162033',

        /* === ACCENT PRIMAIRE — Coral (chaud, énergique) === */
        'coral': '#FF6B4A',
        'coral-light': '#FF8A6E',
        'coral-dark': '#E85A3A',
        'coral-50': '#FFF4F1',

        /* === ACCENT SECONDAIRE — Amber === */
        'amber': '#F59E0B',
        'amber-light': '#FBBF24',
        'amber-dark': '#D97706',

        /* === ACCENT TERTIAIRE — Rose === */
        'rose': '#E11D48',
        'rose-light': '#FB7185',

        /* === VALIDATION — Teal === */
        'teal': '#14B8A6',
        'teal-light': '#2DD4BF',

        /* === BLEU (conservé en tertiaire tech) === */
        'blue': '#2563EB',
        'blue-light': '#3B82F6',

        /* === FONDS CHAUDS === */
        'cream': '#FFF8F5',
        'cream-100': '#FFF1EB',
        'cream-200': '#FFE4D6',
        'sand': '#FEF7ED',
        'sand-100': '#FEF0DC',

        /* === NEUTRES === */
        'warm': '#FAFAF9',
        'warm-100': '#F5F5F4',
        'warm-200': '#E7E5E4',
        'warm-300': '#D6D3D1',
        'muted': '#57534E',
        'muted-light': '#A8A29E',

        /* === LEGACY (compat) === */
        'accent': '#FF6B4A',
        'accent-light': '#FF8A6E',
        'success': '#14B8A6',
        'success-light': '#2DD4BF',
        'gold': '#F59E0B',
        'gold-light': '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.8rem, 6vw, 5rem)', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.03em' }],
        'section': ['clamp(1.85rem, 3.5vw, 3rem)', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'subtitle': ['clamp(1.1rem, 1.5vw, 1.35rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'overline': ['0.75rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.15em' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)',
        'card-lift': '0 20px 60px rgba(0,0,0,0.12)',
        'glow-coral': '0 0 40px rgba(255,107,74,0.2)',
        'glow-coral-lg': '0 0 80px rgba(255,107,74,0.25)',
        'glow-teal': '0 0 40px rgba(20,184,166,0.15)',
        'glow-amber': '0 0 40px rgba(245,158,11,0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-coral': 'linear-gradient(135deg, #FF6B4A 0%, #F59E0B 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B4A 0%, #E11D48 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        'gradient-dark-subtle': 'linear-gradient(180deg, #0f172a 0%, #162033 50%, #0f172a 100%)',
        'gradient-cream': 'linear-gradient(180deg, #FFF8F5 0%, #FFF1EB 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(255,107,74,0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(20,184,166,0.04) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245,158,11,0.04) 0px, transparent 50%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-left': 'slideLeft 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
