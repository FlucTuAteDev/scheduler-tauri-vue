import colors from "vuetify/util/colors";

export enum DayType {
	SHIFT,
	PAID,
	FREEDAY,
	NONWORKING_DAY,
	HOLIDAY,
	WEEKEND,
	REST,
	SICK,
	EMPTY,
}

export interface DayTypeDescription {
	color: string;
	desc: string;
	label: string;
}

export const DAY_TYPE_DESCRIPTIONS = (<const>{
	[DayType.SHIFT]: { color: "#FFFFFF", desc: "Műszak", label: "M" },
	[DayType.PAID]: { color: "#FFC107", desc: "Fizetett szabadság", label: "FSZ" },
	[DayType.FREEDAY]: { color: colors.green.base, desc: "Szabadnap", label: "SZ" },
	[DayType.NONWORKING_DAY]: {
		color: colors.green.darken2,
		desc: "Munkaszüneti nap",
		label: "P",
	},
	[DayType.HOLIDAY]: {
		color: colors.purple.base,
		desc: "Fizetett ünnep",
		label: "FÜ",
	},
	[DayType.WEEKEND]: {
		color: "#007BFF",
		desc: "Szabad hétvége",
		label: "SZH",
	},
	[DayType.REST]: { color: colors.indigo.base, desc: "Pihenőnap", label: "*" },
	[DayType.SICK]: { color: colors.pink.base, desc: "Táppénz", label: "TP" },
	[DayType.EMPTY]: { color: "#FFFFFF", desc: "Üres", label: "-" },
}) satisfies Record<DayType, DayTypeDescription>;
