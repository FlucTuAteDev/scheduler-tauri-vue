// Input style based on https://codepen.io/prasanthmj/pen/EWQPrK

<script setup lang="ts">
import { useTemplateRef } from "vue";

const model = defineModel<number>();

// const { hour24 = false} = defineProps<{
// 	hour24?: boolean;
// }>();

const emit = defineEmits<{
	input: [hour: number];
}>();

const inputFieldRef = useTemplateRef("field");

function add(n: number) {
	emit("input", (model.value ?? 0) + n);
	inputFieldRef.value?.select();
}
// keydown(e: KeyboardEvent) {
// 	if (e.key == "+") {
// 		this.add(1);
// 		e.preventDefault();
// 	}
// 	else if (e.key == "-") {
// 		this.add(-1)
// 		e.preventDefault();
// 	}
// 	else if (e.key == "Tab") {
// 		e.preventDefault()
// 		this.$emit("tab", e);
</script>

<template>
	<div class="wrapper">
		<!-- 			:min="0 + hour24"
			:max="23 + hour24" 
						@focus="$event.target.select()"
			@keydown="keydown"
			
						@input="$emit('input', $event.target?.value)"-->

		<input
			ref="field"
			v-model="model"
			type="number"
			:min="0"
			:max="23"
			step="1"
			:value="model"
			@input="event => $emit('input', (event.target as HTMLInputElement)!.valueAsNumber)"
		/>

		<div class="spinner-nav">
			<div v-ripple class="spinner-button plus" @click="add(1)">+</div>
			<div v-ripple class="spinner-button minus" @click="add(-1)">-</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	position: relative;
	gap: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.wrapper input {
	padding-right: 20px !important;
	height: 42px;
	line-height: 1.65;
	float: left;
	display: block;
	padding: 0;
	margin: 0;
	border: 1px solid #eee;
	text-align: center;
}

.wrapper input:focus {
	outline: 0;
}

.spinner-nav {
	float: left;
	position: relative;
	height: 42px;
}

.spinner-button {
	position: absolute;
	height: 50%;
	cursor: pointer;
	border-left: 1px solid #eee;
	width: 20px;
	text-align: center;
	color: #333;
	font-size: 0.8em;
	line-height: 1.6;
	transform: translateX(-100%);
	user-select: none;
}

.spinner-button.plus {
	top: 0;
	border-bottom: 1px solid #eee;
}

.spinner-button.minus {
	bottom: 0px;
}

.spinner-button:hover {
	background: #eee;
}
</style>
