import config from "@/../tailwind.config";

export function stationToColor(station: string) {
	const parsedStation = station.toUpperCase().charAt(0);
	const { colors } = config.theme.extend;
	switch (parsedStation) {
		case "A":
		case "C":
		case "E":
			return colors.blue;
		case "B":
		case "D":
		case "F":
		case "M":
			return colors.orange;
		case "G":
			return colors["tint-green"];
		case "L":
			return colors["dark-grey"];
		case "J":
		case "Z":
			return colors.brown;
		case "N":
		case "Q":
		case "R":
		case "W":
			return colors.yellow;
		case "1":
		case "2":
		case "3":
			return colors.red;
		case "4":
		case "5":
		case "6":
			return colors.green;
		case "7":
			return colors.purple;
		case "T":
			return colors.teal;
		case "S":
			return colors.black;
		default:
			console.log(station);
			return colors.black;
	}
}
