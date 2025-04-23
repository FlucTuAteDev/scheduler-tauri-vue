<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, useTemplateRef, watch } from "vue";
import _ from "lodash";

const model = defineModel<boolean>();

const {
	targets = [],
	offset = { x: 0, y: 0 },
	// position = { x: 0, y: 0 },
	absolute = false,
	margin = 10,
} = defineProps<{
	targets?: Element[];
	offset?: { x: number; y: number };
	// position?: { x: number; y: number };
	absolute?: boolean;
	margin?: number;
}>();

const position = reactive({ x: 250, y: 250 }); //FIXME: these are default values so popover is visible until proper positioning is developed

// TODO: (maybe) average x, lowest y
const targetStartRect = ref(new DOMRect());
const targetEndRect = ref(new DOMRect());

let updateRects = () => {
	if (targets.length === 0) return;
	targetStartRect.value = _.first(targets)!.getBoundingClientRect();
	targetEndRect.value = _.last(targets)!.getBoundingClientRect();
};

const popoverRef = useTemplateRef("popover"); // Template ref to popover

let popoverWidth = ref(100);
let popoverHeight = ref(100);

let updateDimensions = () => {
	let rect = popoverRef.value?.getBoundingClientRect();
	popoverWidth.value = rect?.width ?? 0;
	popoverHeight.value = rect?.height ?? 0;
};

// ipcRenderer.on("zoom", updateRects);

let x = computed(() => {
	const maxLeft = window.innerWidth - popoverWidth.value - margin;

	let res;
	if (absolute) res = position.x;
	else {
		if (!targetStartRect.value || !targetEndRect.value) return offset.x;
		const { left } = targetStartRect.value;
		const { right } = targetEndRect.value;
		// place popover in the middle of the selection horizontally
		res = left + (right - left - popoverWidth.value) / 2 + offset.x;
	}

	return _.clamp(res, margin, maxLeft);
});

let y = computed(() => {
	let maxTop = window.innerHeight - popoverHeight.value - margin;

	let res;
	if (absolute) res = position.y;
	else {
		if (!targetStartRect.value) return offset.y;
		let { bottom, top } = targetStartRect.value;

		// If the popover would cover the target, move the popover above it
		if (bottom > maxTop) res = top - offset.y - popoverHeight.value;
		else res = bottom + offset.y;
	}

	return _.clamp(res, margin, maxTop);
});

// Save the position of the popover on the first change of absolute
let firstChange = true;
watch(
	() => absolute,
	() => {
		if (firstChange && popoverRef.value) {
			let rect: DOMRect = popoverRef.value?.getBoundingClientRect();
			position.x = rect.x;
			position.y = rect.y;
			firstChange = false;
		}
	},
);

let style = computed(() => {
	return {
		left: x.value + "px",
		top: y.value + "px",
		//"as const" fix for "type 'string' is not assignable to type 'Visibility | undefined'"
		visibility: model.value ? ("visible" as const) : ("hidden" as const),
		opacity: model.value ? "1" : "0",
		transitionDuration: drag.dragging ? "0ms" : "300ms",
	};
});

let drag = {
	offset: { x: 0, y: 0 },
	dragging: false,
};

let dragStart = (e: MouseEvent) => {
	drag.dragging = true;
	//FIXME popover ref is sometimes null here?
	let rect = popoverRef.value?.getBoundingClientRect();
	drag.offset.x = e.x - (rect?.x ?? 0);
	drag.offset.y = e.y - (rect?.y ?? 0);
};

let mousemove = (e: MouseEvent) => {
	if (!drag.dragging || !absolute) return;
	e.preventDefault();
	position.x = e.pageX - drag.offset.x;
	position.y = e.pageY - drag.offset.y;
};
window.addEventListener("mousemove", mousemove);

let mouseup = (/*e: MouseEvent*/) => {
	drag.dragging = false;
};
window.addEventListener("mouseup", mouseup);

onUnmounted(() => {
	window.removeEventListener("mousemove", mousemove);
	window.removeEventListener("mouseup", mouseup);
});

watch(
	() => targets,
	() => {
		updateRects();
		nextTick(updateDimensions);
	},
);
</script>

<template>
	<div ref="popover" class="popover" :style="style" @mousedown="dragStart">
		<slot></slot>
	</div>
</template>

<style scoped>
.popover {
	position: fixed;
	z-index: 5;
	transition-property: left, top, visibility, opacity;
	transition-delay: 0ms, 0ms, 0ms, 100ms;
}
</style>
