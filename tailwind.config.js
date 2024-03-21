/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{tsx,html,js}'],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};

