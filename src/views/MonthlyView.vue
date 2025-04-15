<script setup lang="ts">
import TooltipButton from "../components/TooltipButton.vue";

function undo() {
	console.log("undo");
}
// function redo() {}
// function add() {}
// function save() {}
// function open() {}

// let canUndo = true;
// let canRedo = false;
</script>

<template>
	<v-toolbar class="toolbar">
		<template #prepend>
			<v-divider vertical></v-divider>

			<tooltip-button tooltip="Beosztásban szereplő dolgozók" variant="flat" color="success">
				<v-icon>mdi-account-multiple</v-icon>
			</tooltip-button>
			<tooltip-button tooltip="Gyorsdolgozó" icon="mdi-plus" />
			<v-divider vertical></v-divider>

			<tooltip-button tooltip="Visszavonás" icon="mdi-undo" @click="undo" />
			<tooltip-button tooltip="Újra" icon="mdi-redo" />
			<v-divider vertical></v-divider>

			<tooltip-button tooltip="Fájl megnyitása" icon="mdi-folder-open" />
			<tooltip-button tooltip="Mentés" icon="mdi-floppy" />

			<v-divider vertical></v-divider>
			<!-- <template v-for="(info, i) in toolbarInfo">
				<v-divider vertical :key="i + 'divider'"></v-divider>
				<div class="overline toolbar-info" :key="i + 'info'">
					{{ info }}
				</div>
			</template> -->
		</template>
	</v-toolbar>
</template>

<style lang="css" scoped></style>
