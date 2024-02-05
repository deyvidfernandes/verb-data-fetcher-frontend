import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter", sans-serif'],
			},
			colors: {
				brandBlue: '#66A3FF',
				brandGreen: '#6FD93D',
				brandRed: '#D93D3D',
				brandOrange: '#FF9A24',
				brandScrollOrange: '#FF9A2499',
				brandScrollOrangeHover: '#FF9A24CC',
			},
		},
	},
	plugins: [],
}
