<script setup lang="ts">
import { computed } from "vue";
import TooltipButton from "@/components/TooltipButton.vue";
import { useSheetState } from "@/state/store";
import { format, getYear } from "date-fns";
import { hu } from "date-fns/locale";
import { DayOfWeek, daysOfWeekInMonth, workhoursInMonth } from "@/utils/date";

const sheetState = useSheetState();
const sheet = sheetState.activeSheet;

const toolbarInfo = computed(() => [
	`${getYear(sheet.date)}. ${format(sheet.date, "LLLL", { locale: hu })}`,
	`Havi óraszám: ${workhoursInMonth(sheet.date)}`,
	`SZ: ${daysOfWeekInMonth(sheet.date, DayOfWeek.SATURDAY)}`, // \xA0 -> non-breaking space
	`P: ${daysOfWeekInMonth(sheet.date, DayOfWeek.SUNDAY)}`,
]);

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
		</template>

		<template #append>
			<div id="toolbar-info-container">
				<template v-for="(info, i) in toolbarInfo" :key="i">
					<v-divider vertical></v-divider>
					<div class="text-overline toolbar-info">
						{{ info }}
					</div>
				</template>
			</div>
		</template>
	</v-toolbar>
</template>

<style lang="css" scoped>
#toolbar-info-container {
	display: flex;
	align-items: center;

	gap: 15px;
	padding-inline: 15px;

	height: 100%;
}

.toolbar-info {
	line-height: 1.2rem;
	text-align: center;
	min-width: fit-content;
}
</style>
