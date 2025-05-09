import { type Sheet, type ScheduleDay } from "@/model/schedule-sheet";
import { DayType, type DayTypeDescription, DayTypeDescriptions } from "@/model/day-types";
import { lighten } from "@/utils/color";
import { range } from "lodash-es";

//TODO: discuss aggregate vs accumulator: what is the difference, which term to use?
export interface Aggregate {
	name: string;
	label: string;
	header_color: string;
	background_color: string;
	evaluate: (row: ScheduleDay[]) => number | boolean;
}

// Count how many times the given DayType appears in a schedule row
// Can also take an array of DayTypes to sum up
export class DayTypeCounter implements Aggregate {
	types: DayType[];
	desc: DayTypeDescription;
	constructor(
		types: DayType | DayType[],
		public name: string = "",
		public label: string = "",
		public header_color: string = "",
		public background_color: string = "",
	) {
		//Take single values as single element arrays
		this.types = ([] as DayType[]).concat(types);
		// If we are aggregating multiple DayTypes, pick the first one's name
		this.name = DayTypeDescriptions[this.types[0]].label;
		this.desc = DayTypeDescriptions[this.types[0]];
		this.background_color = background_color || lighten(this.desc.color, 175);
		this.label = label || this.desc.label;
		this.header_color = header_color || this.desc.color;
	}
	evaluate(row: ScheduleDay[]): number {
		// console.log("eval")
		return row.filter(day => this.types.some(type => type == day.type)).length;
		// return row.filter(d => d.type == this.type).length
	}
}

// Counts the total working hours in the row
export class TotalHours implements Aggregate {
	desc = DayTypeDescriptions[DayType.shift];
	constructor(
		public name: string,
		public label: string,
		public header_color: string,
		public background_color: string,
	) {}
	evaluate(row: ScheduleDay[]): number {
		return row.reduce((total, day) => {
			// Sum shifts
			if (day.type === DayType.shift) return total + day.shiftDuration;
			//Paid leave, sick leave and holiday count as an 8 hour day
			if ([DayType.paid, DayType.sick, DayType.holiday].some(x => x === day.type))
				return total + 8;

			return total;
		}, 0);
	}
}

// Standard shifts start at 7 o'clock; more than a certain percentage of shifts should have a different start time for variety
export class ShiftVariety implements Aggregate {
	static differencePercentage: number = 33;
	constructor(
		public name: string,
		public label: string,
		public header_color: string,
		public background_color: string,
	) {}
	evaluate(row: ScheduleDay[]): boolean {
		const [normalShiftCount, differentShiftCount] = row.reduce(
			(acc, curr) => {
				if (curr.shiftStart === 7) acc[0]++;
				else if (curr.type === DayType.shift) acc[1]++;

				return acc;
			},
			[0, 0],
		);
		// console.log(normalShiftCount, differentShiftCount);

		return (differentShiftCount / normalShiftCount) * 100 > ShiftVariety.differencePercentage;
	}
}

// Some shifts should be 8 hours or shorter
class SomeShortShifts implements Aggregate {
	desc = DayTypeDescriptions[DayType.shift];
	constructor(
		public name: string,
		public label: string,
		public header_color: string,
		public background_color: string,
	) {}
	evaluate(row: ScheduleDay[]): boolean {
		return row.filter(d => d.type == DayType.shift && d.shiftDuration <= 8).length > 1;
	}
}

export const accumulators: Array<Aggregate> = [
	new TotalHours("totalHours", "Össz. óra", "#FFFFFF", "#FFFFFF"),
	new ShiftVariety("shiftVariety", "33%", "#FFFFFF", "#FFFFFF"),
	new SomeShortShifts("someShortShifts", "2x8", "#FFFFFF", "#FFFFFF"),
	...[DayType.paid, DayType.sick, [DayType.freeday, DayType.nonworking_day, DayType.weekend]].map(
		t => new DayTypeCounter(t),
	),
];

export class StartTimeCount {
	counts: number[];
	constructor(
		public hour: number,
		length: number,
	) {
		this.counts = new Array(length).fill(0);
	}
}

export function CountStartingTimes(sheet: Sheet): Map<number, number[]> {
	const counter = new Map<number, number[]>();

	//FIXME: there must be an easier way to implement this
	for (const row of sheet.schedule) {
		for (let i = 0; i < sheet.monthLength; i++) {
			const day = row.getDay(i + 1);
			if (day.type != DayType.shift) continue;

			const start = day.shiftStart;
			if (!counter.has(start)) counter.set(start, new Array(sheet.monthLength).fill(0));
			counter.get(start)![i] += 1;
		}
	}

	return new Map([...counter].sort((a, b) => a[0] - b[0])); //Sort ascending by hour
}

// Counts how many employees are present between the given start and end hours
export function CountPresentBetween(sheet: Sheet, start: number, end: number) {
	const result = new Array(sheet.monthLength).fill(0);

	const targetHours = hoursBetween(start, end);
	for (const row of sheet.schedule) {
		for (let i = 0; i < sheet.monthLength; i++) {
			const day = row.getDay(i + 1);
			if (day.type != DayType.shift) continue;

			const currentHours = hoursBetween(day.shiftStart, day.shiftEnd);
			// If the target shift is within the current shift
			if (targetHours.every(x => currentHours.includes(x))) result[i] += 1;
		}
	}

	return result;
}

export function hoursBetween(start: number, end: number) {
	if (start <= end) return range(start, end);

	return range(start, 24 + end).map(hour => hour % 24);

	// Original implementation
	// const hours = [];
	// for (let currentHour = start; currentHour !== end; currentHour = (currentHour + 1) % 25)
	// 	hours.push(currentHour);

	// return hours;
}
