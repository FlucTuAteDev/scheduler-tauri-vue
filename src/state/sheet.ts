export interface RecentSheetInfo {
	year: number;
	month: number;
	employeeCount: number;
	modified?: Date;
	opened?: Date;
	path: string;
}

export class SheetState {
	// sheet: Sheet = new Sheet(2021, 8);
	// undoStack = new Array<Array<Operation>>();
	// redoStack = new Array<Array<Operation>>();
	// clipboard = new Array<Operation>();
	// recentSheets: RecentSheetInfo[] = [];
}
