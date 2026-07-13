module.exports = {
	content: [
		"./index.html", 
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', 'sans-serif'],
				heading: ['Outfit', 'sans-serif'],
			},
			colors: {
				brand: {
					DEFAULT: '#7E420F',
					dark: '#5E3819',
					light: '#9A5A1F',
					50: '#FDF8F3',
					100: '#F9EDE0',
					200: '#F0D5B8',
					300: '#E5B88A',
					400: '#D4944E',
					500: '#7E420F',
					600: '#6B3810',
					700: '#5A2F0E',
					800: '#4A270C',
					900: '#3A1E0A',
				},
				accent: {
					DEFAULT: '#EA8A54',
					light: '#F0A57A',
					dark: '#D4712E',
				},
				gold: {
					DEFAULT: '#C9A96E',
					light: '#DFC79A',
					dark: '#A88B4C',
				},
				surface: {
					DEFAULT: '#FAF6F2',
					warm: '#F2ECE7',
					card: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#6E6E6E',
					light: '#888888',
					lighter: '#777777',
					border: '#D0CECC',
				}
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
				'slide-in-right': 'slideInRight 0.6s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'marquee': 'marquee 30s linear infinite',
				'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
			},
			keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				pulseSoft: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},
			},
			boxShadow: {
				'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
				'nav': '0 2px 20px rgba(0, 0, 0, 0.08)',
				'button': '0 4px 14px rgba(126, 66, 15, 0.3)',
				'button-hover': '0 6px 20px rgba(126, 66, 15, 0.4)',
			},
			borderRadius: {
				'2xl': '16px',
				'3xl': '24px',
				'4xl': '32px',
			},
		},
	},
	plugins: [],
}