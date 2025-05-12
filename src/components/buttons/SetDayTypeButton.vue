<script setup lang="ts">
import { type DayType, DAY_TYPE_DESCRIPTIONS } from "@/model/day-types";

import AcceleratedTooltipButton from "./AcceleratedTooltipButton.vue";
import { computed } from "vue";

const props = defineProps<{
	dayType: DayType;
	accelerator: string | string[]; // accelerator is a required prop of accelerated-tooltip-button, otherwise we could pass it as an attr
}>();

const dayTypeInfo = computed(() => DAY_TYPE_DESCRIPTIONS[props.dayType]);
</script>

<template>
	<accelerated-tooltip-button
		:key="dayType"
		:type="dayType"
		:tooltip="dayTypeInfo.desc"
		:color="dayTypeInfo.color"
		v-bind="{ accelerator }"
		rounded="circle"
		width="4rem"
		height="4rem"
	>
		{{ dayTypeInfo.label }}
	</accelerated-tooltip-button>
</template>
