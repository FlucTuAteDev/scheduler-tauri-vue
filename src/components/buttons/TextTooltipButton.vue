<script setup lang="ts">
import BaseTooltipButton from "./BaseTooltipButton.vue";

defineProps<{
	tooltip: string;
}>();
</script>

<template>
	<base-tooltip-button>
		<slot></slot>
		<template #tooltip>
			{{ tooltip }}
		</template>
	</base-tooltip-button>
</template>
