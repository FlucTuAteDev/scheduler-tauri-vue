import { DayTypeCounter, hoursBetween, TotalHours } from "@/model/aggregates";
import { DayType } from "@/model/day-types";
import { Sheet } from "@/model/schedule-sheet";
import { Employee } from "@/model/staff";
import { expect } from "@wdio/globals";

describe("Row aggregation", () => {
	describe("hoursBetween function", () => {
		it("handles single hour", () => {
			expect(hoursBetween(1, 2)).toEqual([1]);
		});
		it("handles longer intervals", () => {
			expect(hoursBetween(2, 4)).toEqual([2, 3]);
			expect(hoursBetween(12, 16)).toEqual([12, 13, 14, 15]);
		});
		it("handles going across days", () => {
			expect(hoursBetween(23, 3)).toEqual([23, 0, 1, 2]);
		});
	});

	describe("Aggregate classes", () => {
		const exampleSheet = new Sheet(2025, 5);
		const exampleRow = exampleSheet.addRow(new Employee("Joe Example", "test-id"));

		exampleRow.getDay(1).setType(DayType.rest);
		exampleRow.getDay(2).setType(DayType.weekend);
		exampleRow.getDay(3).setType(DayType.weekend);

		describe("DayTypeCounter class", () => {
			it("counts single DayTypes", () => {
				const restCounter = new DayTypeCounter(DayType.rest);
				const weekendCounter = new DayTypeCounter(DayType.weekend);

				expect(restCounter.evaluate(exampleRow.days)).toBe(1);
				expect(weekendCounter.evaluate(exampleRow.days)).toBe(2);
			});

			it("sums up multiple DayTypes", () => {
				const combinedCounter = new DayTypeCounter([DayType.rest, DayType.weekend]);
				expect(combinedCounter.evaluate(exampleRow.days)).toBe(3);
			});
		});

		exampleRow.getDay(4).setShift(19, 12);
		exampleRow.getDay(5).setShift(8, 8);
		describe("TotalHours class", () => {
			it("counts work hours", () => {
				const totalHours = new TotalHours(
					"TotalHours",
					"Total Hours test",
					"black",
					"white",
				);

				expect(totalHours.evaluate(exampleRow.days)).toBe(12 + 8);
				// expect(totalHours.evaluate([new ScheduleDay(_, 0, DayType.holiday)])).toBe(12 + 8);
			});
		});
	});
});
