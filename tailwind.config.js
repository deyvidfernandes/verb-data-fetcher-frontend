/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
    fontFamily: {
      sans: ['"Inter", sans-serif']
    },
		colors: {
      white: '#FFF',
			green: '#6FD93D',
			red: '#D93D3D',
			gray: '#999999',
			orange: '#FF9A24',
		},
	},
	plugins: [],
}
