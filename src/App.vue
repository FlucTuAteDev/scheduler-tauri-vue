<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";

const inputValue = ref("");
const greet = ref("");
async function callBackend() {
	greet.value = await invoke<string>("greet", { name: inputValue.value });
}
</script>

<template>
	<v-app>
		<v-text-field id="text-field" v-model="inputValue"></v-text-field>
		<v-btn id="button" @click="callBackend">Button</v-btn>
		<div id="greet">{{ greet }}</div>
	</v-app>
</template>
