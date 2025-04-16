import { getDaysInMonth } from "date-fns";

export interface RecentSheetInfo {
	year: number;
	month: number;
	employeeCount: number;
	modified?: Date;
	opened?: Date;
	path: string;
}

export class Sheet {
	month_length: number;
	// schedule: Array<ScheduleRow> = [];
	date: Date;

	constructor(year: number, month: number /* employees: Employee[] = [] */) {
		this.date = new Date(year, month, 1);
		this.month_length = getDaysInMonth(this.date);
		// for (const employee of employees) {
		// 	this.AddRow(employee);
		// }
	}

	// AddRow(employee: string | number | Employee) {
	// 	if (typeof employee == "string" || typeof employee == "number")
	// 		employee = staff.GetEmployee(employee);
	// 	this.schedule.push(new ScheduleRow(this, employee, this.month_length));
	// }
	// GetRow(employee: string | number): ScheduleRow {
	// 	if (typeof employee == "string") {
	// 		const result = this.schedule.find(r => r.employee.name == employee);
	// 		if (!result) throw new Error(`Nincs '${employee}' nevű dolgozó ezen a munkalapon! `);
	// 		return result;
	// 	}

	// 	return this.schedule[employee];
	// }
}
