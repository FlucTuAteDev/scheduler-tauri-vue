import colors from "vuetify/util/colors";

export enum DayType {
	shift,
	paid,
	freeday,
	nonworking_day,
	holiday,
	weekend,
	rest,
	sick,
	empty,
}

export interface DayTypeDescription {
	color: string;
	desc: string;
	label: string;
}

export const DayTypeDescriptions = {
	[DayType.shift]: { color: "#FFFFFF", desc: "Műszak", label: "M" },
	[DayType.paid]: { type: "paid", color: "#FFC107", desc: "Fizetett szabadság", label: "FSZ" },
	[DayType.freeday]: { color: colors.green.base, desc: "Szabadnap", label: "SZ" },
	[DayType.nonworking_day]: {
		color: colors.green.darken2,
		desc: "Munkaszüneti nap",
		label: "P",
	},
	[DayType.holiday]: {
		type: "holiday",
		color: colors.purple.base,
		desc: "Fizetett ünnep",
		label: "FÜ",
	},
	[DayType.weekend]: {
		color: "#007BFF",
		desc: "Szabad hétvége",
		label: "SZH",
	},
	[DayType.rest]: { color: colors.indigo.base, desc: "Pihenőnap", label: "*" },
	[DayType.sick]: { color: colors.pink.base, desc: "Táppénz", label: "TP" },
	[DayType.empty]: { color: "#FFFFFF", desc: "Üres", label: "-" },
} as Record<DayType, DayTypeDescription>;
