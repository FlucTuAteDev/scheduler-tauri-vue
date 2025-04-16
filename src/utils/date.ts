import { getDay, getDaysInMonth, setDate } from "date-fns";

// DateFns convention:
// date - day of month (e.g: setDate)
// day - day of week (monday - sunday)

export enum DayOfWeek {
	SUNDAY,
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
}

/**
 * Calculates how many times a specific day of the week occurs in the given month.
 * @param date Represents any day within the target month
 * @param day The day of the week to count
 *
 * @example
 * // Returns 4, because there are 4 Sundays in April 2025
 * daysOfWeekInMonth(new Date("2025.04.16"), DayOfWeek.SUNDAY)
 */
export function daysOfWeekInMonth(date: Date, day: DayOfWeek) {
	const firstDayOfMonth = getDay(setDate(date, 1));

	const diff = ((7 + (day - firstDayOfMonth)) % 7) + 1;
	return Math.floor((getDaysInMonth(date) - diff) / 7) + 1;
}

/**
 * Calculates how many work hours are there in the given month
 * assuming that all weekdays are workdays
 * @param date Represents any day within the target month
 */
export function workhoursInMonth(date: Date, workhoursPerDay = 8) {
	const workdayCount =
		getDaysInMonth(date) -
		daysOfWeekInMonth(date, DayOfWeek.SATURDAY) -
		daysOfWeekInMonth(date, DayOfWeek.SUNDAY);
	return workdayCount * workhoursPerDay;
}
