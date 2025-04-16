import { defineStore } from "pinia";
import { Sheet, type RecentSheetInfo } from "../model/schedule-sheet";
import { type Reactive, reactive } from "vue";

// export class SheetState {
// sheet: Sheet = new Sheet(2021, 8);
// undoStack = new Array<Array<Operation>>();
// redoStack = new Array<Array<Operation>>();
// clipboard = new Array<Operation>();
// }

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

	const activeSheet = reactive(new Sheet(2025, 4));
	return {
		recentSheets,
		activeSheet,
	};
});
