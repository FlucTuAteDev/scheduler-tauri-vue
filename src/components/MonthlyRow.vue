<script setup lang="ts">
import { computed, type Reactive } from "vue";
import ScheduleDayComponent from "@/components/ScheduleDay.vue";
import { type ScheduleRow } from "@/model/schedule-sheet";
import { type SelectionState } from "@/composables/selectionState";
import { type Aggregate } from "@/model/aggregates";

const props = defineProps<{
	row: ScheduleRow;
	selection: Reactive<SelectionState>;
	// error_groups: ErrorGroup[],
	aggregates: Aggregate[];
}>();

const emit = defineEmits<{
	"day-mouse-down": [number];
	"day-mouse-up": [number];
	"day-mouse-enter": [number];
	"employee-contextmenu": [MouseEvent];
}>();

function down(i: number) {
	emit("day-mouse-down", i);
}
function up(i: number) {
	emit("day-mouse-up", i);
}
function enter(i: number) {
	emit("day-mouse-enter", i);
}

const days = computed(() => props.row.days);
const employeeName = computed(() => props.row.employee.name);

const accumulatorValues = computed(() => props.aggregates.map(a => a.evaluate(days.value)));
const counterStyles = computed(() =>
	props.aggregates.map((aggregate, index) => ({
		backgroundColor: aggregate.background_color,
		//FIXME: this calculation is duplicated (and brittle)
		right: (props.aggregates.length - 1 - index) * 3 + "em", //right side sticky columns
	})),
);
</script>

<template>
	<tr>
		<th @contextmenu="$emit('employee-contextmenu', $event)">
			{{ employeeName }}
		</th>
		<!-- :error_groups="error_groups.filter(x => x.days.includes(index))" :duration="data.duration"
		:start="data.start" :type="data.type" -->
		<schedule-day-component
			v-for="scheduleDay in days"
			:key="scheduleDay.day"
			:schedule-day="scheduleDay"
			:selection="selection"
			@mousedown.left.prevent.stop="down(scheduleDay.day)"
			@mouseup.left.stop="up(scheduleDay.day)"
			@mouseenter="enter(scheduleDay.day)"
		/>
		<td
			v-for="(acc, i) in accumulatorValues"
			:key="aggregates[i].label"
			class="sticky-right text-center counter"
			:style="counterStyles[i]"
		>
			<v-icon v-if="typeof acc === 'boolean'" :color="acc ? 'success' : 'warning'">
				{{ acc ? "mdi-check" : "mdi-alert" }}
			</v-icon>
			<span v-else>{{ acc }}</span>
		</td>
	</tr>
</template>

<style scoped>
th {
	filter: opacity(1);
	border-right: 4px double #ccc;
	z-index: 1;
	outline: none;
}
.counter {
	/* filter: brightness(120%) saturate(50%); */
	border: 1px solid #ccc;
	position: sticky;
	background-color: white;
	width: 100vw;
}
.counter::before {
	/* content: "asd"; */
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: white;
	filter: opacity(90%);
}
.sticky-right {
	position: sticky;
	/* right: 0; */
	z-index: 1;
}
</style>
