
import type { Config } from "tailwindcss";

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
		extend: {
			colors: {
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
					accent: 'hsl(var(--omni-orange))',
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
				heading: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'sans-serif'
				]
			},
			backgroundImage: {
				'rainbow-gradient': 'linear-gradient(135deg, hsl(var(--omni-red)) 0%, hsl(var(--omni-orange)) 16.66%, hsl(var(--omni-yellow)) 33.33%, hsl(var(--omni-green)) 50%, hsl(var(--omni-blue)) 66.66%, hsl(var(--omni-indigo)) 83.33%, hsl(var(--omni-violet)) 100%)',
				'rainbow-subtle': 'linear-gradient(135deg, hsl(var(--omni-red) / 0.1) 0%, hsl(var(--omni-orange) / 0.1) 16.66%, hsl(var(--omni-yellow) / 0.1) 33.33%, hsl(var(--omni-green) / 0.1) 50%, hsl(var(--omni-blue) / 0.1) 66.66%, hsl(var(--omni-indigo) / 0.1) 83.33%, hsl(var(--omni-violet) / 0.1) 100%)',
				'wellhub-gradient': 'linear-gradient(135deg, hsl(180 25% 15%) 0%, hsl(var(--omni-orange)) 100%)'
			},
			animation: {
				'rainbow': 'rainbow 8s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
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
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
