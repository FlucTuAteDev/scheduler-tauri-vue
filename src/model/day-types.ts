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
	type: string;
	color: string;
	desc: string;
	label: string;
}

export const DayTypeDescriptions = [
	{ type: "shift", color: "#FFFFFF", desc: "Műszak", label: "M" },
	{ type: "paid", color: "#FFC107", desc: "Fizetett szabadság", label: "FSZ" },
	{ type: "freeday", color: colors.green.base, desc: "Szabadnap", label: "SZ" },
	{
		type: "nonworking_day",
		color: colors.green.darken2,
		desc: "Munkaszüneti nap",
		label: "P",
	},
	{
		type: "holiday",
		color: colors.purple.base,
		desc: "Fizetett ünnep",
		label: "FÜ",
	},
	{
		type: "free_weekend",
		color: "#007BFF",
		desc: "Szabad hétvége",
		label: "SZH",
	},
	{ type: "rest", color: colors.indigo.base, desc: "Pihenőnap", label: "*" },
	{ type: "sick", color: colors.pink.base, desc: "Táppénz", label: "TP" },
	{ type: "empty", color: "#FFFFFF", desc: "Üres", label: "-" },
] as DayTypeDescription[];
