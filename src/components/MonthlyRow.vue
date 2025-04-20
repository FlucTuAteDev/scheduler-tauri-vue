<script setup lang="ts">
import { computed } from "vue";
import ScheduleDayComponent from "@/components/ScheduleDay.vue";
import { type ScheduleRow } from "@/model/schedule-sheet";

const props = defineProps<{
	row: ScheduleRow;
	// selection: [],
	// error_groups: ErrorGroup[],
	// aggregates: Aggregate[],
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

// accumulator_values(): (number | boolean)[] {
//       return this.aggregates.map((a) => a.evaluate(this.days as ScheduleDay[]));
//     },
//     counter_styles(): Array<any> {
//       // return aggregates.map(a => ({ backgroundColor: a.header_color }))
//       return this.aggregates.map((a, i) => ({
//         backgroundColor: a.background_color,
//         right: (this.aggregates.length - 1 - i) * 3 + "em", //right side sticky columns
//       }));
//     },
</script>

<template>
	<tr>
		<th @contextmenu="$emit('employee-contextmenu', $event)">
			{{ employeeName }}
		</th>
		<!-- :error_groups="error_groups.filter(x => x.days.includes(index))" :duration="data.duration"
		:start="data.start" :selection="selection" :type="data.type" -->
		<schedule-day-component
			v-for="scheduleDay in days"
			:key="scheduleDay.day"
			:schedule-day="scheduleDay"
			@mousedown.left.prevent.stop="down(scheduleDay.day)"
			@mouseup.left.stop="up(scheduleDay.day)"
			@mouseenter="enter(scheduleDay.day)"
		/>
		<!-- <td
			class="sticky-right text-center counter"
			v-for="(acc, i) in accumulator_values"
			:style="counter_styles[i]"
			:key="aggregates[i].label"
		>
			<v-icon v-if="typeof acc === 'boolean'" :color="acc ? 'success' : 'warning'">
				{{ acc ? "mdi-check" : "mdi-alert" }}
			</v-icon>
			<span v-else>{{ acc }}</span>
		</td> -->
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
