import { clamp } from "lodash";

class RGB {
	constructor(
		public red: number,
		public green: number,
		public blue: number,
	) {}
}

export function hexToRGB(color: string): RGB {
	color = color.replace("#", "");
	const r = parseInt(color.substring(0, 2), 16); // hexToR
	const g = parseInt(color.substring(2, 4), 16); // hexToG
	const b = parseInt(color.substring(4, 6), 16); // hexToB
	return new RGB(r, g, b);
}
//Based on https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function RGBToHex(color: RGB) {
	const r = clamp(Math.round(color.red), 0, 255);
	const g = clamp(Math.round(color.green), 0, 255);
	const b = clamp(Math.round(color.blue), 0, 255);
	return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

//Based on https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export function fontColorFromBackground(
	bgColor: string,
	lightColor = "#FFFFFF",
	darkColor = "#000000",
) {
	const { red, green, blue } = hexToRGB(bgColor);

	return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? darkColor : lightColor;
}

export function lighten(hex: string, amount: number) {
	let { red, green, blue } = hexToRGB(hex);
	red += amount;
	green += amount;
	blue += amount;
	return RGBToHex(new RGB(red, green, blue));
}
