<script setup lang="ts">
// import store from "@/state/store";
// import { Employee, type Staff } from "@/model/staff";
// import EmployeeTable from "@/components/staff/EmployeePickerTable.vue";
// import moment from "moment";
import { computed, ref } from "vue";
import { useSheetState } from "@/state/store";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

import { formatRelative, format } from "date-fns";
import { hu } from "date-fns/locale";

// const { useState: useStaffState } = createNamespacedHelpers<Staff>(
// 	store,
// 	"staff",
// );
const sheetState = useSheetState();

// const { employees } = useStaffState(["employees"]);
// const newSheetDialog = ref(false);
const loading = ref(false);
// const selection = ref(employees.value);
// const datePicker = ref(new Date().toISOString().substring(0, 10));

const recents = computed(() =>
	sheetState.recentSheets.map(
		entry =>
			<const>[
				entry.path,
				entry.year,
				format(new Date(entry.year, entry.month), "LLLL", {
					locale: hu,
				}),
				entry.employeeCount,
				entry.modified
					? formatRelative(entry.modified, new Date(), { locale: hu })
					: undefined,
				entry.path,
			],
	),
);

// function importRecentSheet(path: string) {
// 	loading.value = true;
// 	ipcRenderer.send("import", path);
// }

async function reveal(path: string) {
	await revealItemInDir(path);
}

// function newSheet() {
// 	this.$router.push("/");
// 	const date = new Date(this.datePicker);
// 	this.$store.dispatch("new_sheet", {
// 		year: date.getFullYear(),
// 		month: date.getMonth(),
// 		employees: this.selection,
// 	});
// },
</script>

<template>
	<div v-if="!loading" class="wrapper">
		<!-- <v-dialog v-model="newSheetDialog" width="unset" height="80%">
			<template v-slot:activator="{ on, attrs }">
				<div class="sheet new-sheet-button" v-bind="attrs" v-on="on">
					<v-icon x-large>mdi-plus</v-icon>
					<span class="overline">Új beosztás</span>
				</div>
			</template>
			<v-card class="dialog">
				<v-card-title class="text-h5 grey lighten-2">
					Új beosztás
				</v-card-title>
				<v-date-picker
					v-model="datePicker"
					full-width
					type="month"
					min="2020-01"
					locale="hu-hu"
					show-current="false"
				></v-date-picker>
				<v-divider></v-divider>
				<employee-table
					class="employeeTable"
					v-model="selection"
					:defaultSelection="employees"
				></employee-table>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						text
						@click="newSheet"
						:disabled="selection.length < 1"
					>
						Létrehozás
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog> -->
		<!-- @click="importRecentSheet(path)" -->
		<button
			v-for="[filename, year, month, numEmployees, timeAgo, path] in recents"
			:key="path"
			v-ripple
			class="sheet"
		>
			<v-fab
				variant="plain"
				class="reveal-in-explorer"
				size="small"
				icon="mdi-open-in-new"
				@click.stop="reveal(path)"
			>
			</v-fab>

			<span class="font-weight-bold overline">
				<v-icon color="info">mdi-calendar</v-icon>
				<br />
				{{ year }}. {{ month }}
			</span>
			<span class="filename">
				<v-icon color="green">mdi-microsoft-excel</v-icon>
				<br />
				&lrm;{{ filename }}
				<!-- HACK: left side ellipsis requires RTL text which does play nice with the "/" in the path, so &lrm; is added  -->
			</span>
			<span class="caption">
				<v-icon color="secondary">mdi-account-multiple</v-icon>
				{{ numEmployees }} dolgozó
			</span>
			<div v-if="timeAgo" class="timeAgo caption">
				<v-icon>mdi-file-clock-outline</v-icon>
				<span>
					Módosítva: <br />
					{{ timeAgo }}
				</span>
			</div>
		</button>
	</div>
	<div v-else class="pt-10 text-center">
		<v-progress-circular indeterminate color="grey" :size="50"></v-progress-circular>
	</div>
</template>

<style scoped lang="scss">
.employeeTable {
	flex-direction: column;
	flex-grow: 1;
}
.dialog {
	min-width: 400px;
	max-width: 600px;
}
.sheet {
	border: 3px solid #ccc;
	background: #fff;
	display: grid;
	position: relative;
	align-items: center;
	grid-template-rows: repeat(4, 1fr);
	justify-content: center;
	width: 200px;
	height: 300px !important;
	gap: 5px;
	border-radius: 20px;

	&:hover {
		filter: brightness(98%);
		& > .v-icon {
			transform: scale(110%);
		}
	}
	.filename {
		padding: 10px;
		text-align: center;
		max-width: 200px;
		// word-wrap: break-word;
		white-space: nowrap;
		overflow: hidden;

		//ellipsis at the start https://stackoverflow.com/a/74455333
		direction: rtl;
		text-overflow: ellipsis;
	}
	.timeAgo {
		display: flex;
		gap: 5px;
		text-align: left;
		font-style: italic;
		justify-content: center;
	}
}
.new-sheet-button {
	justify-content: center;
}
.reveal-in-explorer {
	top: 0;
	right: 0;
	max-height: max-content;
	position: absolute;
}
.wrapper {
	display: flex;
	align-content: center;
	justify-content: center;
	height: 100%;
	gap: 3% 3%;
	flex-wrap: wrap;
}
</style>
