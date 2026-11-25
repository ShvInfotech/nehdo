// Nehdo design tokens.
//  - Storefront: namespaced `v2-*` tokens from src/styles/tailwind.theme.cjs
//  - Admin panel: `brand`, `accent`, `muted`, `font-heading`, `font-mono` below,
//    tuned to the same plum / coral brand so both feel like one product.
const v2 = require("./src/styles/tailwind.theme.cjs");

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				...v2.colors,
				brand: {
					DEFAULT: '#5B2A6E',
					light:   '#7A4594',
					dark:    '#2E1238',
					50:  '#F7F2F9',
					100: '#EDE4F2',
					200: '#DCC8E5',
					300: '#C1A0D0',
					400: '#9C6BB3',
					500: '#7A4594',
					600: '#5B2A6E',
					700: '#4A2259',
					800: '#3A1A46',
					900: '#2E1238',
				},
				accent: { DEFAULT: '#F2714E', light: '#F58E71', dark: '#D9583A' },
				muted:  { DEFAULT: '#6B6170', light: '#8C8391', border: '#E7E2EA' },
			},

			fontFamily: {
				sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
				heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
				mono:    ['"DM Mono"', 'ui-monospace', 'monospace'],
				...v2.fontFamily,
			},

			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},

			// Tailwind's default radius scale, plus the storefront's v2-* radii
			borderRadius: {
				...v2.borderRadius,
			},

			boxShadow: {
				// admin surfaces
				card:   '0 1px 2px rgb(46 18 56 / 0.04), 0 1px 3px rgb(46 18 56 / 0.06)',
				'card-hover': '0 4px 16px -4px rgb(46 18 56 / 0.12), 0 2px 4px rgb(46 18 56 / 0.06)',
				button: '0 1px 2px rgb(46 18 56 / 0.12)',
				'button-hover': '0 4px 12px -2px rgb(91 42 110 / 0.35)',
				...v2.boxShadow,
			},

			gridTemplateColumns: {
				'12': 'repeat(12, minmax(0, 1fr))',
			},
		},
	},
	plugins: [],
};
