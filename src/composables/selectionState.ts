import { type Reactive, reactive, type Ref } from "vue";
import { clamp, range } from "lodash";
import { type Sheet } from "@/model/schedule-sheet";

class SelectionState {
	//The drag start and end are represented by day numbers (e.g 1...31) and are clamped by their setters to 1...monthLength
	private _start = 0;
	private _end = 0;
	private _employeeIndex = 0;

	active = false;
	dragging = false;

	constructor(private sheet: Reactive<Sheet>) {}

	get start() {
		return this._start;
	}
	set start(value: number) {
		this._start = clamp(value, 1, this.sheet.monthLength);
	}

	get end() {
		return this._end;
	}
	set end(value: number) {
		this._end = clamp(value, 1, this.sheet.monthLength);
	}

	get employeeIndex() {
		return this._employeeIndex;
	}
	set employeeIndex(value: number) {
		this._employeeIndex = clamp(value, 0, this.sheet.schedule.length - 1);
	}
	get selectionLeft() {
		return Math.min(this.start, this.end);
	}

	get selectionRight() {
		return Math.max(this.start, this.end);
	}

	get selectedDays(): number[] {
		//E.g. (selectionLeft: 5, selectionRight: 7) => [5,6,7]
		if (this.selectionRight == 0) return [];
		return range(this.selectionLeft, this.selectionRight + 1);
	}
}

export function useSelection(sheet: Reactive<Sheet>, popoverVisible: Ref<boolean>) {
	// lastCursorPos has been replaced: while selectionActive is false, the dragstate hold the last active selection
	// Old implementation:
	// let lastCursorPos = {
	// 	employeeIndex: 0,
	// 	end: 1,
	// };
	const selection = reactive(new SelectionState(sheet));

	function dragStart(index: number, day: number) {
		selection.dragging = true;
		selection.active = true;
		selection.employeeIndex = index;
		selection.start = day;
		selection.end = day;
		popoverVisible.value = false;
	}
	function dragEnter(_index: number, day: number) {
		if (selection.dragging) {
			selection.end = day;
		}
	}
	function dragEnd(_index: number, day: number) {
		if (selection.dragging) {
			selection.end = day;
			popoverVisible.value = true;
		}
		selection.dragging = false;
	}
	function dragEndEmpty() {
		dragEnd(selection.employeeIndex, selection.end);
	}

	//The drag may have started from the right, so drag.start could be smaller or
	//  bigger than drag.end, while selectionLeft <= selectionRight

	//Slide selection using arrow keys
	function moveSelection(dx: number, dy: number, event: KeyboardEvent): void {
		// If there is no selection, restore the last cursor position
		if (selection.active == false) {
			selection.active = true;
			selection.start = selection.end;
		} else {
			selection.employeeIndex = selection.employeeIndex + dy;
			selection.end = selection.end + dx;
			//If shift is held, expand the selection in the arrow key's direction
			selection.start = !event.shiftKey ? selection.end : selection.start;
		}

		popoverVisible.value = true;
	}

	function setSelection(start: number, end: number, employee_index: number): void {
		selection.start = start;
		selection.end = end;

		selection.employeeIndex = employee_index;
		popoverVisible.value = true;
	}

	function deselect() {
		selection.active = false;
		popoverVisible.value = false;
	}

	return {
		selection,
		dragStart,
		dragEnter,
		dragEnd,
		dragEndEmpty,
		deselect,
		setSelection,
		moveSelection,
	};
}
