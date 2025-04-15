<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

defineProps<{
	icon?: string;
	tooltip?: string;
}>();
</script>

<template>
	<v-tooltip location="bottom">
		<template #activator="{ props }">
			<!--  -->
			<v-btn v-bind="{ ...props, ...$attrs }" :icon="$slots.default ? undefined : icon">
				<v-icon v-if="icon"> {{ icon }}</v-icon>
				<slot></slot>
			</v-btn>
		</template>
		<span>{{ tooltip }}</span>
	</v-tooltip>
</template>
