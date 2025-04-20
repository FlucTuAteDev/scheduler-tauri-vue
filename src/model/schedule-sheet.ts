import { getDaysInMonth, setDate } from "date-fns";
import { type Employee } from "./staff";
import { DayType } from "./day-types";

export interface RecentSheetInfo {
	year: number;
	month: number;
	employeeCount: number;
	modified?: Date;
	opened?: Date;
	path: string;
}

export class Sheet {
	monthLength: number;
	schedule: ScheduleRow[] = [];
	date: Date;

	constructor(year: number, month: number, employees: Employee[] = []) {
		this.date = new Date(year, month, 1);
		this.monthLength = getDaysInMonth(this.date);
		for (const employee of employees) {
			this.addRow(employee);
		}
	}

	addRow(employee: Employee) {
		this.getRow(employee);

		this.schedule.push(new ScheduleRow(this, employee, this.monthLength));
	}

	getRow(employee: Employee): ScheduleRow | undefined {
		return this.schedule.find(row => row.employee === employee);
	}
}

export class ScheduleRow {
	// employee_name : string
	days: ScheduleDay[];
	constructor(
		public sheet: Sheet,
		public employee: Employee,
		length: number,
	) {
		this.days = Array.from(Array(length), (_, i) => new ScheduleDay(this, i + 1));
	}

	setShift(day: number, start: number, duration = 12) {
		this.getDay(day).setShift(start, duration);
	}
	deleteShift(day: number) {
		this.days[day - 1].clear();
	}
	getDay(day: number): ScheduleDay {
		if (day < 1 || day > this.days.length) throw new Error("Érvénytelen nap ");

		return this.days[day - 1];
	}
}

export class ScheduleDay {
	date: Date;
	constructor(
		public row: ScheduleRow,
		public day: number,
		public type: DayType = DayType.empty,
		public shiftStart: number = 0,
		public shiftDuration = 0,
	) {
		this.date = setDate(this.row.sheet.date, day);
	}

	public get shiftEnd() {
		if (this.type != DayType.shift)
			throw Error("Az olyan napoknak, amik nem műszakok nincs végső időpontja.");

		const end = (this.shiftStart + this.shiftDuration) % 24;
		return end ? end : 24;
	}

	clear() {
		this.setType(DayType.empty);
	}
	setShift(start: number, duration: number) {
		this.type = DayType.shift;
		this.shiftStart = start;
		this.shiftDuration = duration;
	}
	setType(type: DayType) {
		if (type != DayType.shift) {
			this.shiftStart = 0;
			this.shiftDuration = 0;
		}
		this.type = type;
	}
}
