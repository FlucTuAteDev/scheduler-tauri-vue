<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

const { icon } = defineProps<{
	icon?: string;
}>();
</script>

<template>
	<v-tooltip location="bottom">
		<template #activator="{ props }">
			<!-- 
			Vuetify button ignores the icon prop if anything is in its default slot, including slots...
			That's why there are two seemingly identical buttons, that way there is no slot in the button
			-->
			<v-btn v-if="icon" v-bind="{ ...props, ...$attrs }" :icon="icon"> </v-btn>
			<v-btn v-else v-bind="{ ...props, ...$attrs }">
				<slot></slot>
			</v-btn>
		</template>
		<slot name="tooltip"></slot>
	</v-tooltip>
</template>
