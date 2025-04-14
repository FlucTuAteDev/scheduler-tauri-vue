import { defineStore } from "pinia";
import { type RecentSheetInfo } from "./sheet";
import { type Reactive, reactive } from "vue";

export const useSheetState = defineStore("sheet", () => {
	const recentSheets: Reactive<RecentSheetInfo[]> = reactive([
		{
			year: 2020,
			month: 8,
			employeeCount: 10,
			modified: new Date(),
			opened: new Date(),
			path: "/etc/hosts",
		},
		{
			year: 2021,
			month: 8,
			employeeCount: 10,
			modified: undefined,
			opened: undefined,
			path: "/etc/hosts",
		},
		{
			year: 2022,
			month: 8,
			employeeCount: 10,
			modified: new Date(),
			opened: new Date(),
			path: "/etc/hosts",
		},
	]);
	return {
		recentSheets,
	};
});
