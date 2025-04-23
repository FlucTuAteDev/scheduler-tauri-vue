import { computed, type Reactive, reactive, type Ref } from "vue";
import { clamp, range } from "lodash";
import { type Sheet } from "@/model/schedule-sheet";

class DragState {
	//The drag start and end are represented by day numbers (e.g 1...31) and are clamped by their setters to 1...monthLength
	private _start = 0;
	private _end = 0;
	private _employeeIndex = 0;

	selectionActive = false;
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
}

export function useDragState(sheet: Reactive<Sheet>, popoverVisible: Ref<boolean>) {
	// lastCursorPos has been replaced: while selectionActive is false, the dragstate hold the last active selection
	// Old implementation:
	// let lastCursorPos = {
	// 	employeeIndex: 0,
	// 	end: 1,
	// };
	const drag = reactive(new DragState(sheet));

	function dragStart(index: number, day: number) {
		drag.dragging = true;
		drag.selectionActive = true;
		drag.employeeIndex = index;
		drag.start = day;
		drag.end = day;
		popoverVisible.value = false;
	}
	function dragEnter(_index: number, day: number) {
		if (drag.dragging) {
			drag.end = day;
		}
	}
	function dragEnd(_index: number, day: number) {
		if (drag.dragging) {
			drag.end = day;
			popoverVisible.value = true;
		}
		drag.dragging = false;
	}
	function dragEndEmpty() {
		dragEnd(drag.employeeIndex, drag.end);
	}

	//The drag may have started from the right, so drag.start could be smaller or
	//  bigger than drag.end, while selectionLeft <= selectionRight
	const selectionLeft = computed(() => Math.min(drag.start, drag.end));
	const selectionRight = computed(() => Math.max(drag.start, drag.end));

	const selection = computed((): number[] => {
		//E.g. (selectionLeft: 5, selectionRight: 7) => [5,6,7]
		if (selectionRight.value == 0) return [];
		return range(selectionLeft.value, selectionRight.value + 1);

		// Old implementation:
		// return Array(selection_end.value - selection_start.value + 1)
		// .fill(0)
		// .map((x, i) => i + selection_start.value);
	});

	//Slide selection using arrow keys
	function moveSelection(dx: number, dy: number, event: KeyboardEvent): void {
		// If there is no selection, restore the last cursor position
		if (drag.selectionActive == false) {
			drag.selectionActive = true;
			drag.start = drag.end;
		} else {
			drag.employeeIndex = drag.employeeIndex + dy;
			drag.end = drag.end + dx;
			//If shift is held, expand the selection in the arrow key's direction
			drag.start = !event.shiftKey ? drag.end : drag.start;
		}

		popoverVisible.value = true;
	}

	function setSelection(start: number, end: number, employee_index: number): void {
		drag.start = start;
		drag.end = end;

		drag.employeeIndex = employee_index;
		popoverVisible.value = true;
	}

	function deselect() {
		drag.selectionActive = false;
		popoverVisible.value = false;
	}

	return {
		drag,
		dragStart,
		dragEnter,
		dragEnd,
		dragEndEmpty,
		deselect,
		selectionLeft,
		selectionRight,
		selection,
		setSelection,
		moveSelection,
	};
}
