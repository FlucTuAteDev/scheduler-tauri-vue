<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import HourPicker from "@/components/pickers/HourPicker.vue";

export interface Shift {
	start: number;
	end: number;
	duration: number;
}

//Q: what does focus do?
// const { focus = false } = defineProps<{
// 	focus?: boolean;
// }>();

const emit = defineEmits<{
	input: [shift: Shift];
}>();

const start = ref();
const end = ref();

const shift = reactive({
	start: 7,
	end: 19,
	duration: 12,
});

const displayedEnd = computed(() => (shift.end ? shift.end : 24));

//if user changes the start, keep duration the same and set end accordingly
let inputStart = (newStart: number) => {
	shift.start = Math.round(Math.abs(newStart + 24)) % 24;
	shift.end = (shift.duration + shift.start) % 24;
	emit("input", shift);
	// console.log(shift);
};
//if user changes end, decrease duration and keep start the same
let inputEnd = (newEnd: number) => {
	shift.end = Math.round(Math.abs(Number(newEnd) + 24)) % 24;
	shift.duration = (shift.start < shift.end ? 0 : 24) + shift.end - shift.start;
	emit("input", shift);
	// console.log(newEnd, shift);
};

// const inputStartRef = useTemplateRef("start");
// const inputEndRef = useTemplateRef("end");

// function focusOn(target: "start" | "end") {
// 	const focusTarget = target == "start" ? inputStartRef : inputEndRef;
// 	console.log(focusTarget.value);
// 	focusTarget.value.focus();
// }

// watch(
// 	() => focus,
// 	(curr: boolean) => {
// 		if (curr) setTimeout(() => focusOn("start"), 100);
// 	},
// );
</script>

<template>
	<div>
		<hour-picker ref="start" v-model="shift.start" @input="inputStart" />
		<!-- @tab="focusOn('end') -->
		<span>-</span>
		<hour-picker ref="end" :model-value="displayedEnd" :hour24="true" @input="inputEnd" />
		<!-- @tab="focusOn('start')" -->
	</div>
</template>

<style scoped>
div {
	display: flex;
	gap: inherit;
	align-items: center;
}
/* div > * {
	padding: 0 7.5px;
}
div:first-child {
	padding-left: 0;
}
div:last-child {
	padding-right: 0;
} */
</style>
