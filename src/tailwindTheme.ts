/** @type {import('tailwindcss').Config} */
export const tailwindConfig = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter", sans-serif'],
			},
			colors: {
				brandBlue: '#66A3FF',
				brandGreen: '#6FD93D',
				brandLightGreen: 'hsl(101, 67%, 65%)',
				brandDarkGreen: '#57c026',
				brandRed: '#D93D3D',
				brandLightRed: 'hsl(0, 67%, 65%)',
				brandDarkRed: 'rgb(192, 38, 38)',
				brandOrange: '#FF9A24',
				brandScrollOrange: '#FF9A2499',
				brandScrollOrangeHover: '#FF9A24CC',
			},
		},
	},
	plugins: [],
}

import resolveConfig from 'tailwindcss/resolveConfig'

const config = resolveConfig(tailwindConfig)
export const tailwindTheme = config.theme
