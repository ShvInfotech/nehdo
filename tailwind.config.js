// UI v2 tokens (namespaced `v2`, additive — does not change any v1 class)
const v2 = require("./src/ui-v2/theme/tailwind.v2.cjs");

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			// ─── NEHDO WELLNESS DESIGN TOKENS ───────────────────────────────
			colors: {
				paper:   '#F4EEE6',   // 60% — main bg, warm off-white
				ink:     '#1B1412',   // 25% — text, near-black brown
				oxblood: '#6B1F2A',   // 25% — primary brand, dark sections
				clay:    '#C4553A',   // 5%  — accent, badges, hover (sparingly)
				sand:    '#E3D6C6',   // 10% — cards, dividers, secondary surfaces
				sage:    '#8A9A86',   // 5%  — success states, tags
				...v2.colors,
				// Legacy aliases kept so existing admin/checkout pages don't break
				brand: {
					DEFAULT: '#6B1F2A',
					dark:    '#4A1520',
					light:   '#8B2F3A',
					50:  '#FDF8F3',
					100: '#F4EEE6',
					200: '#E3D6C6',
					300: '#C4553A',
					400: '#8B2F3A',
					500: '#6B1F2A',
					600: '#5A1A23',
					700: '#4A1520',
					800: '#3A101A',
					900: '#2A0B12',
				},
				accent:  { DEFAULT: '#C4553A', light: '#D4654A', dark: '#A44530' },
				gold:    { DEFAULT: '#8A9A86', light: '#9AAA96', dark: '#7A8A76' },
				surface: { DEFAULT: '#F4EEE6', warm: '#EDE5DA', card: '#E3D6C6' },
				muted:   { DEFAULT: '#5A4E48', light: '#7A6E68', border: '#D0C8BE' },
			},

			// ─── TYPOGRAPHY ─────────────────────────────────────────────────
			fontFamily: {
				serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
				sans:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
				mono:    ['"DM Mono"', '"Fira Code"', 'monospace'],
				// Legacy aliases
				heading: ['"Instrument Serif"', 'Georgia', 'serif'],
				...v2.fontFamily,
			},

			fontSize: {
				'hero':  ['clamp(48px,8vw,120px)',   { lineHeight: '0.95', letterSpacing: '-0.02em' }],
				'h2':    ['clamp(36px,5vw,72px)',    { lineHeight: '1.05', letterSpacing: '-0.015em' }],
				'h3':    ['clamp(24px,3vw,42px)',    { lineHeight: '1.15', letterSpacing: '-0.01em' }],
				'body':  ['17px',                   { lineHeight: '1.6' }],
				'label': ['12px',                   { lineHeight: '1', letterSpacing: '0.08em' }],
			},

			// ─── SPACING ────────────────────────────────────────────────────
			spacing: {
				'section-desktop': '120px',
				'section-mobile':  '64px',
				'18': '4.5rem',
				'22': '5.5rem',
			},

			// ─── BORDERS ────────────────────────────────────────────────────
			borderRadius: {
				DEFAULT: '2px',
				sm:   '2px',
				md:   '4px',
				lg:   '4px',
				xl:   '4px',
				'2xl':'4px',
				'3xl':'4px',
				full: '9999px',
				...v2.borderRadius,
			},

			borderWidth: { DEFAULT: '1px', '0': '0', '2': '2px' },

			// ─── SHADOWS — none by design (editorial / no glassmorphism) ────
			boxShadow: {
				none:         'none',
				card:         'none',
				'card-hover': 'none',
				button:       'none',
				'button-hover':'none',
				nav:          'none',
				...v2.boxShadow,
			},

			// ─── ANIMATION ──────────────────────────────────────────────────
			animation: {
				'fade-up':     'fadeUp 400ms ease-out both',
				'marquee':     'marquee 32s linear infinite',
				'marquee-rev': 'marqueeRev 32s linear infinite',
			},
			keyframes: {
				fadeUp: {
					'0%':   { opacity: '0', transform: 'translateY(12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				marquee: {
					'0%':   { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				marqueeRev: {
					'0%':   { transform: 'translateX(-50%)' },
					'100%': { transform: 'translateX(0%)' },
				},
			},

			// ─── GRID ───────────────────────────────────────────────────────
			gridTemplateColumns: {
				'12':   'repeat(12, minmax(0, 1fr))',
				'7-5':  '7fr 5fr',
				'5-7':  '5fr 7fr',
				'editorial': '1fr minmax(0, 760px) 1fr',
			},
		},
	},
	plugins: [],
};
