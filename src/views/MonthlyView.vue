<script setup lang="ts">
import { ref, computed, useTemplateRef, onUnmounted } from "vue";
import TextTooltipButton from "@/components/buttons/TextTooltipButton.vue";
import { useSheetState } from "@/state/store";
import { format, getYear } from "date-fns";
import { hu } from "date-fns/locale";
import { DayOfWeek, daysOfWeekInMonth, workhoursInMonth } from "@/utils/date";
import { useStaffState } from "@/state/staff";
import MonthlyRow from "@/components/MonthlyRow.vue";
import AcceleratedTooltipButton from "@/components/buttons/AcceleratedTooltipButton.vue";
import DayTypePopover from "@/components/popovers/DayTypePopover.vue";
import { useDragState } from "@/composables/dragSelection";
import { throttle } from "lodash";
import { type DayType } from "@/model/day-types";
import { type Shift } from "@/components/pickers/ShiftPicker.vue";

const sheetState = useSheetState();
const sheet = sheetState.activeSheet;

const { addEmployee, getEmployeeCount } = useStaffState();

const toolbarInfo = computed(() => [
	`${getYear(sheet.date)}. ${format(sheet.date, "LLLL", { locale: hu })}`,
	`Havi óraszám: ${workhoursInMonth(sheet.date)}`,
	`SZ: ${daysOfWeekInMonth(sheet.date, DayOfWeek.SATURDAY)}`,
	`P: ${daysOfWeekInMonth(sheet.date, DayOfWeek.SUNDAY)}`,
]);

function undo() {
	console.log("undo");

	getDayElement(0, 1);
}

function quickAddEmployee() {
	const employee = addEmployee(`Példa János ${getEmployeeCount()}`);
	sheet.addRow(employee);
}
// function redo() {}
// function add() {}
// function save() {}
// function open() {}

// let canUndo = true;
// let canRedo = false;

const popoverVisible = ref(false);
//FIXME: https://vuejs.org/guide/essentials/template-refs states: "It should be noted that the ref array does not guarantee the same order as the source array."
const monthlyRowsRef = useTemplateRef("schedule-rows");

function arrowKeyDown(e: KeyboardEvent) {
	const bindings = {
		ArrowRight: [1, 0],
		ArrowLeft: [-1, 0],
		ArrowUp: [0, -1],
		ArrowDown: [0, 1],
	};
	const bind = Object.entries(bindings).find(b => b[0] == e.key);
	if (bind) {
		const [dx, dy] = bind[1] as [number, number];
		if (e.ctrlKey) {
			// setTableScroll.value(dx * 40, dy * 40);
		} else {
			moveSelection(dx, dy, e);
			// context.root.$nextTick(() => selection_tracker.scrollIntoView(selection_elements.value, setTableScroll.value));
		}
	}
}
let arrowKeyDownThrottled = throttle(arrowKeyDown, 100);
window.addEventListener("keydown", arrowKeyDownThrottled);
onUnmounted(() => window.removeEventListener("keydown", arrowKeyDownThrottled));

function getDayElement(employeeIndex: number, day: number): Element | undefined {
	// let employeeId = sheet.schedule[index]?.employee.id;

	if (!monthlyRowsRef.value) {
		console.error(`Could not find monthlyRows ref`);
		return undefined;
	}

	// console.log(monthlyRows.value?.find(row => row?.$props.row.employee));
	const dayElement = monthlyRowsRef.value[employeeIndex]?.$el?.children[day];

	if (!dayElement) {
		console.error(`Could not find element ${employeeIndex}:${day}`);
		return undefined;
	}

	// console.log(dayElement);

	return dayElement;
}

const { drag, moveSelection, deselect, selection } = useDragState(sheet, popoverVisible);

const selectionElements = computed(() =>
	selection.value
		.map(day => getDayElement(drag.employeeIndex, day))
		.filter(el => el != undefined),
);

const selectedScheduleDays = computed(() =>
	selection.value.map(day => sheet.schedule[drag.employeeIndex].getDay(day)),
);
// const cursorElement = computed(() =>
// 	drag.end > 0 ? getDayElement(drag.employeeIndex, drag.end) : undefined,
// );

function setShift(shift: Shift) {
	if (!drag.selectionActive) return;
	for (const day of selectedScheduleDays.value) {
		day.setShift(shift.start, shift.duration);
	}
}

function setDayType(dayType: DayType) {
	if (!drag.selectionActive) return;
	for (const day of selectedScheduleDays.value) {
		day.setType(dayType);
	}
}
</script>

<template>
	<v-toolbar class="toolbar">
		<template #prepend>
			<v-divider vertical></v-divider>

			<text-tooltip-button
				tooltip="Beosztásban szereplő dolgozók"
				variant="flat"
				color="success"
			>
				<v-icon>mdi-account-multiple</v-icon>
			</text-tooltip-button>
			<text-tooltip-button tooltip="Gyorsdolgozó" icon="mdi-plus" @click="quickAddEmployee" />
			<v-divider vertical></v-divider>

			<accelerated-tooltip-button
				tooltip="Visszavonás"
				icon="mdi-undo"
				accelerator="ctrl+z"
				@click="undo"
			/>
			<accelerated-tooltip-button
				tooltip="Újra"
				icon="mdi-redo"
				:accelerator="['ctrl+y', 'ctrl+shift+z']"
			/>
			<v-divider vertical></v-divider>

			<text-tooltip-button tooltip="Fájl megnyitása" icon="mdi-folder-open" />
			<text-tooltip-button tooltip="Mentés" icon="mdi-floppy" />

			<v-divider vertical></v-divider>
		</template>

		<template #append>
			<div id="toolbar-info-container">
				<template v-for="(info, i) in toolbarInfo" :key="i">
					<v-divider vertical></v-divider>
					<div class="text-overline toolbar-info">
						{{ info }}
					</div>
				</template>
			</div>
		</template>
	</v-toolbar>

	<!-- 			@close="deselect" 
							-->

	<day-type-popover
		ref="base"
		v-model="popoverVisible"
		:selection-elements="selectionElements"
		@close="deselect"
		@set-day-type="setDayType"
		@set-shift="setShift"
	/>

	<div v-if="sheet.schedule.length > 0" id="table-wrapper" ref="table_wrapper" class="ma-1">
		<table class="table">
			<thead>
				<tr>
					<th class="names-header">Név</th>
					<!-- 
					:style="day_header_style[day - 1]"
					@mouseenter="setDayInfoTarget($event.target)"
					@mouseleave="dayinfo = false"
					@contextmenu="aggregatesContextMenu"
					-->
					<th v-for="day in sheet.monthLength" :key="day" :ref="'header' + day">
						{{ day }}
					</th>
					<!-- <th
						v-for="(label, i) in right_side_headers"
						:key="label"
						class="header-sticky-right"
						:style="header_styles[i]"
						@contextmenu="aggregatesContextMenu"
					>
						{{ label }}
					</th> -->
				</tr>
			</thead>
			<tbody>
				<!-- :selection="i == drag.employee_index ? selection : []"
				:error_groups="error_groups[i]"
				@day-mouse-down="dragStart(i, $event)"
				@day-mouse-up="dragEnd(i, $event)"
				@day-mouse-enter="dragEnter(i, $event)"
				@employee-contextmenu="employeeContextMenu($event, row.employee)"
				v-bind="{ row, aggregates }" -->
				<monthly-row
					v-for="(row, i) in sheet.schedule"
					:key="row.employee.id"
					ref="schedule-rows"
					:selection="drag.selectionActive && i == drag.employeeIndex ? selection : []"
					v-bind="{ row }"
				/>
			</tbody>
		</table>
	</div>
	<div v-if="sheet.schedule.length == 0" class="text-center mt-3">
		Ez a beosztás nem tartalmaz dolgozót. <br />
		<!-- @click="employeePicker = true" -->
		<v-btn
			variant="plain"
			class="text-overline"
			prepend-icon="mdi-account-plus"
			@click="quickAddEmployee"
		>
			<template #prepend>
				<v-icon color="primary"></v-icon>
			</template>
			<!-- <v-icon left color="primary"></v-icon> -->
			<span>Dolgozó hozzáadása</span>
		</v-btn>
	</div>
</template>

<style lang="css" scoped>
.names-header {
	min-width: 10em;
	border-right-style: double;
}

#toolbar-info-container {
	display: flex;
	align-items: center;

	gap: 15px;
	padding-inline: 15px;

	height: 100%;
}

.toolbar-info {
	line-height: 1.2rem;
	text-align: center;
	min-width: fit-content;
}

#table-wrapper {
	overflow: auto;
	position: relative;
	border: 1px solid #eee;
	scroll-behavior: smooth;
	max-height: calc(100vh - 136px);
}
</style>

<style lang="scss">
.table {
	position: relative;
	border-collapse: separate;
	table-layout: fixed;
	user-select: none;
	border-spacing: 0;

	thead th {
		position: sticky;
		top: 0;
		background: #000;
		color: #fff;
		z-index: 1;
		height: 3em;

		&:hover {
			filter: invert(15%);
		}
		&:first-child {
			left: 0;
			z-index: 2;
		}
	}

	tbody th {
		position: sticky;
		left: 0;
		background: #fff;
		border: 1px solid #ccc;
	}
}
</style>
