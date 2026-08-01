
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		// Extended breakpoints for ISO 9241-300 compliance
		screens: {
			'xs': '320px',    // Small phones - WCAG mobile baseline
			'sm': '640px',    // Large phones / Small tablets
			'md': '768px',    // Tablets
			'lg': '1024px',   // Small laptops
			'xl': '1280px',   // Desktops
			'2xl': '1536px',  // Large desktops
			'3xl': '1920px',  // Full HD displays
			'4xl': '2560px',  // 2K/4K displays
		},
		extend: {
			colors: {
				// Celebrating Women Who Protect Life event palette. Namespaced
				// so it cannot collide with the site's own rose/teal system —
				// this page is a deliberate visual island (its own header and
				// footer too), per the design handoff.
				wwpl: {
					plum: '#2A0A1E',       // deepest brand plum — hero base, sticky bar, medallions
					plum2: '#43122E',      // mid plum — gradient stops, feature card
					plum3: '#5A1A3E',      // lightest plum — gradient highlight, link hover
					gold: '#D9B36C',       // primary accent — buttons, rules, dots
					goldLight: '#F0D9A8',  // gold on dark — captions, numerals, quotes
					goldDeep: '#9C7434',   // gold on light — eyebrows, links, labels
					rose: '#C98A9E',       // secondary accent — eyebrows on plum only
					ink: '#15201F',        // body text, dark sections, footer
					inkSoft: '#33403E',    // long-form prose (between ink and slate)
					slate: '#5A6A68',      // secondary text
					line: '#E1DDD1',       // hairlines, input borders
					cream: '#F6F1E8',      // tinted section background
					creamSoft: '#FAFAF7',  // page background, input fill
					paper: '#FFFFFF',      // cards, header
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				omni: {
					red: 'hsl(var(--omni-red))',
					orange: 'hsl(var(--omni-orange))', 
					yellow: 'hsl(var(--omni-yellow))',
					green: 'hsl(var(--omni-green))',
					blue: 'hsl(var(--omni-blue))',
					indigo: 'hsl(var(--omni-indigo))',
					violet: 'hsl(var(--omni-violet))'
				},
				wellhub: {
					primary: 'hsl(180 25% 15%)',
					accent: 'hsl(25 85% 55%)',
					light: 'hsl(35 15% 97%)'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'sans-serif'
				],
				// Alias of the sans stack — the design system's "body" family.
				body: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'sans-serif'
				],
				heading: [
					'"DM Serif Display"',
					'Georgia',
					'"Times New Roman"',
					'serif'
				],
				serif: [
					'"DM Serif Display"',
					'Georgia',
					'"Times New Roman"',
					'serif'
				],
				// Celebrating Women Who Protect Life event landing page only.
				// Strict roles per the design handoff: display for headings,
				// pull-quotes and numerals; cond for EVERY uppercase micro-label
				// (eyebrows, times, tags, kickers, roles). Body stays Inter.
				'wwpl-display': [
					'"Cormorant Garamond"',
					'Georgia',
					'serif'
				],
				'wwpl-cond': [
					'Oswald',
					'"Arial Narrow"',
					'sans-serif'
				]
			},
			backgroundImage: {
				'rainbow-gradient': 'linear-gradient(135deg, hsl(var(--omni-red)) 0%, hsl(var(--omni-orange)) 16.66%, hsl(var(--omni-yellow)) 33.33%, hsl(var(--omni-green)) 50%, hsl(var(--omni-blue)) 66.66%, hsl(var(--omni-indigo)) 83.33%, hsl(var(--omni-violet)) 100%)',
				'rainbow-subtle': 'linear-gradient(135deg, hsl(var(--omni-red) / 0.05) 0%, hsl(var(--omni-orange) / 0.05) 16.66%, hsl(var(--omni-yellow) / 0.05) 33.33%, hsl(var(--omni-green) / 0.05) 50%, hsl(var(--omni-blue) / 0.05) 66.66%, hsl(var(--omni-indigo) / 0.05) 83.33%, hsl(var(--omni-violet) / 0.05) 100%)',
				'wellhub-gradient': 'linear-gradient(135deg, hsl(180 25% 15%) 0%, hsl(25 85% 55%) 100%)',
				'wellhub-light-gradient': 'linear-gradient(135deg, hsl(35 15% 98%) 0%, hsl(35 20% 95%) 100%)'
			},
			boxShadow: {
				// Note: --shadow-lg is tinted plum, not neutral — it belongs to
				// the brand and should not be swapped for a grey shadow.
				'wwpl-md': '0 4px 14px rgba(21,32,31,.08), 0 12px 32px rgba(21,32,31,.06)',
				'wwpl-lg': '0 12px 40px rgba(42,10,30,.18), 0 30px 80px rgba(42,10,30,.12)',
			},
			transitionTimingFunction: {
				// The house ease-out — use for anything that travels.
				'wwpl': 'cubic-bezier(.22,.61,.36,1)',
			},
			animation: {
				'rainbow': 'rainbow 8s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				// Event page ambient motion. Every consumer gates these behind
				// motion-safe:, so reduced-motion users get a static page.
				'wwpl-float': 'wwpl-float 8s ease-in-out infinite',
				'wwpl-pulse': 'wwpl-pulse 2.6s ease-in-out infinite',
				'wwpl-shimmer': 'wwpl-shimmer 7s linear infinite',
			},
			keyframes: {
				'wwpl-float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				'wwpl-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(217,179,108,.5)' },
					'50%': { boxShadow: '0 0 0 20px rgba(217,179,108,0)' }
				},
				'wwpl-shimmer': {
					'0%': { backgroundPosition: '250% center' },
					'100%': { backgroundPosition: '-250% center' }
				},
				rainbow: {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' }
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
