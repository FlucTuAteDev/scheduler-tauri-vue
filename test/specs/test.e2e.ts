import { DayOfWeek, daysOfWeekInMonth, workhoursInMonth } from "../../src/utils/date";
import { expect } from "@wdio/globals";

describe("Date util functions", () => {
	describe("daysOfWeekInMonth function", () => {
		it("handles general cases", () => {
			const april2025 = new Date("2025.04.16");
			expect(daysOfWeekInMonth(april2025, DayOfWeek.MONDAY)).toBe(4);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.TUESDAY)).toBe(5);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.WEDNESDAY)).toBe(5);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.THURSDAY)).toBe(4);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.FRIDAY)).toBe(4);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.SATURDAY)).toBe(4);
			expect(daysOfWeekInMonth(april2025, DayOfWeek.SUNDAY)).toBe(4);

			const august2025 = new Date("2025.08.30");
			expect(daysOfWeekInMonth(august2025, DayOfWeek.MONDAY)).toBe(4);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.TUESDAY)).toBe(4);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.WEDNESDAY)).toBe(4);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.THURSDAY)).toBe(4);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.FRIDAY)).toBe(5);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.SATURDAY)).toBe(5);
			expect(daysOfWeekInMonth(august2025, DayOfWeek.SUNDAY)).toBe(5);
		});

		it("handles leap year", () => {
			const leapFebruary = new Date("2024.02.01");

			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.MONDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.TUESDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.WEDNESDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.THURSDAY)).toBe(5);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.FRIDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.SATURDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.SUNDAY)).toBe(4);
		});

		it("handles Y2K38 problem", () => {
			const leapFebruary = new Date("2038.12.13");

			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.MONDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.TUESDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.WEDNESDAY)).toBe(5);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.THURSDAY)).toBe(5);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.FRIDAY)).toBe(5);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.SATURDAY)).toBe(4);
			expect(daysOfWeekInMonth(leapFebruary, DayOfWeek.SUNDAY)).toBe(4);
		});
	});

	describe("workhoursInMonth function", () => {
		const april2025 = new Date("2025.04.16");
		it("handles general cases", () => {
			expect(workhoursInMonth(april2025)).toBe(22 * 8);
		});

		it("handles workhoursPerDay parameter", () => {
			expect(workhoursInMonth(april2025, 4)).toBe(22 * 4);
		});
	});
});
