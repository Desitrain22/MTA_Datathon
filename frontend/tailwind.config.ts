import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				black: "#4A1C00",
				"dark-grey": "#B6A595",
				"light-grey": "#F0E1C2",
				white: "#FFF8E1",
				pink: "#E75B76",
				red: "#BC2C19",
				orange: "#DC502D",
				yellow: "#DC9900",
				green: "#48A064",
				teal: "#07859B",
				blue: "#234686",
				purple: "#744486",
				brown: "#74443D",
				"tint-pink": "#E5BBAE",
				"tint-orange": "#E2B89A",
				"tint-yellow": "#E5CC91",
				"tint-green": "#C1CDAA",
				"tint-teal": "#AFC4B7",
				"tint-blue": "#B2B4B0",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [tailwindAnimate],
};
