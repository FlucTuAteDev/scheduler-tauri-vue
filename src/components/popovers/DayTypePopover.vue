<script setup lang="ts">
import { DayType } from "@/model/day-types";
import ShiftPicker, { type Shift } from "@/components/pickers/ShiftPicker.vue";
import BasePopover from "@/components/popovers/BasePopover.vue";
import AcceleratedTooltipButton from "@/components/buttons/AcceleratedTooltipButton.vue";
import { type Ref, ref, watch } from "vue";
import SetDayTypeButton from "../buttons/SetDayTypeButton.vue";

// interface LeaveButtonData {
// 	type: string;
// 	color: string;
// 	tooltip: string;
// 	label: string;
// }

const model = defineModel<boolean>();

const { selectionElements = [] } = defineProps<{
	selectionElements?: Element[];
}>();

const emit = defineEmits<{
	"close": [];
	"set-shift": [shift: Shift];
	"set-day-type": [dayType: DayType];
}>();

function close() {
	emit("close");
}

const shift: Ref<Shift> = ref({ start: 7, end: 19, duration: 12 });
const dayTypeButtons: DayType[] = [
	DayType.paid,
	DayType.freeday,
	DayType.nonworking_day,
	DayType.weekend,
	DayType.sick,
	DayType.holiday,
];

const accelerators: string[] = ["f", "s", "p", "h", "t", "ü", "Delete", "Enter", "Escape"]; //Last three are used only in IgnoreKeys
const pinned = ref(true);
const last_action = ref(""); //TODO: restrict type?

function setShift(newShift: Shift, newBatch: boolean = false) {
	shift.value = newShift;
	if (last_action.value !== "set-shift" || newBatch) {
		createNewBatch();
	}

	emit("set-shift", shift.value);
	last_action.value = "set-shift";

	console.log("set-shift", shift.value);
}

function setType(dayType: DayType) {
	createNewBatch();
	emit("set-day-type", dayType);

	last_action.value = "set-type";

	console.log("set-day-type", dayType);
}

function createNewBatch() {
	console.log("new undo batch");
}
watch(() => selectionElements, createNewBatch);

// 	computed: {
// 		desc() {
// 			return DayTypeDescriptions;
// 		},
// 	},

// 	created() {
// 		window.addEventListener("keydown", this.ignoreKeys);
// 	},
// 	unmounted() {
// 		window.removeEventListener("keydown", this.ignoreKeys);
// 	},
// 	methods: {
// 		newBatch() {
// 			this.$store.dispatch("new_batch");
// 		},

// 		updateRects() {
// 			// @ts-ignore
// 			this.$refs.base.updateRects();
// 		},
// 		ignoreKeys(e: KeyboardEvent) {
// 			if (!this.value) return;
// 			let k = e.key;
// 			//Arrow key, Ctrl + *, any single letter, any accelerator
// 			if (
// 				k.startsWith("Arrow") ||
// 				e.ctrlKey ||
// 				(k.length == 1 && k.toLowerCase() != k.toUpperCase()) ||
// 				this.accelerators.includes(k)
// 			)
// 				e.preventDefault();
// 		},
// 	},
// });
</script>

<template>
	<base-popover
		ref="base"
		v-model="model"
		:targets="selectionElements"
		:offset="{ x: 0, y: 12 }"
		:absolute="pinned"
	>
		<v-card ref="card" class="card">
			<div class="close-button">
				<accelerated-tooltip-button
					variant="plain"
					color="secondary"
					x-small
					elevation="0"
					tooltip="Rögzítés"
					accelerator="-"
					:icon="pinned ? 'mdi-pin' : 'mdi-pin-outline'"
					@click="pinned = !pinned"
				/>
				<accelerated-tooltip-button
					variant="plain"
					color="secondary"
					size="small"
					elevation="0"
					tooltip="Bezárás"
					accelerator="Escape"
					icon="mdi-close"
					@click="close"
				>
				</accelerated-tooltip-button>
			</div>
			<div class="upper">
				<shift-picker :focus="model" @input="setShift"> </shift-picker>

				<accelerated-tooltip-button
					:type="DayType.shift"
					tooltip="Műszak"
					accelerator="Enter"
					@click="setShift(shift, true)"
				>
					<v-icon>mdi-set-split</v-icon>
				</accelerated-tooltip-button>
				<accelerated-tooltip-button
					:type="DayType.empty"
					dark
					tooltip="Törlés"
					color="red"
					accelerator="Delete"
					@click="setType(DayType.empty)"
				>
					<v-icon>mdi-delete</v-icon>
				</accelerated-tooltip-button>
			</div>
			<div class="lower">
				<set-day-type-button
					v-for="(dayType, i) in dayTypeButtons"
					:key="dayType"
					:day-type="dayType"
					:accelerator="accelerators[i]"
					@click="setType(dayType)"
				/>
			</div>
		</v-card>
	</base-popover>
</template>

<style scoped>
.card {
	border: 1px solid transparent;
	/* border: 1px solid grey; */
}
.v-text-field {
	width: 4em;
}
.upper,
.lower {
	margin: 1em;
	display: flex;
	align-items: center;
}
.upper {
	gap: 12px;
	justify-content: center;
}
.lower {
	gap: 8px;
	justify-content: space-between;
}

.close-button {
	position: absolute;
	top: 0;
	right: 0;
}
</style>
