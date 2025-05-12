<script setup lang="ts">
import { capitalize } from "lodash-es";
import { computed, onMounted, onUnmounted } from "vue";
import BaseTooltipButton from "./BaseTooltipButton.vue";

const { tooltip, accelerator: acceleratorProp } = defineProps<{
	tooltip: string;
	accelerator: string | string[];
}>();

const emit = defineEmits<{
	click: [InputEvent?];
}>();

onMounted(() => {
	window.addEventListener("keydown", keydown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", keydown);
});

const accelerators = computed(() => {
	if (typeof acceleratorProp === "string") return [acceleratorProp];

	return acceleratorProp;
});

const keybinds = computed(() =>
	accelerators.value.map(accelerator =>
		accelerator
			.split("+")
			.map(key => capitalize(key))
			.join("+"),
	),
);

function click(event?: InputEvent) {
	emit("click", event);
}

function getKeyCombination(e: KeyboardEvent) {
	const modifierKeyNames = ["ctrl", "alt", "shift"];
	const pressedModifierKeys = [e.ctrlKey, e.altKey, e.shiftKey];

	return [
		...modifierKeyNames.filter((_, index) => pressedModifierKeys[index]),
		e.key.toLowerCase(),
	].join("+");
}

function keydown(e: KeyboardEvent) {
	if (
		accelerators.value.some(accelerator => getKeyCombination(e) === accelerator.toLowerCase())
	) {
		click();
	}
	// console.log(e, getKeyCombination(e));
}
</script>

<template>
	<base-tooltip-button @click="$emit('click', $event)">
		<template #tooltip>
			<div id="tooltip-container">
				<span>{{ tooltip }}</span>
				<div id="keybind-container">
					<template v-for="keybind in keybinds" :key="keybind">
						<v-kbd class="kbd">
							<span class="keybind">{{ keybind }}</span>
						</v-kbd>
					</template>
				</div>
			</div>
		</template>

		<slot></slot>
	</base-tooltip-button>
</template>

<style scoped>
#tooltip-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3px;
}

#keybind-container {
	display: flex;
	align-items: center;
	gap: 6px;
}

.kbd {
	height: min-content;
}

.keybind {
	font-size: x-small;
}
/* .fab:focus::before {
	opacity: 0 !important;
}
.fab:hover::before {
	opacity: 0.15 !important;
} */
</style>
