<script setup lang="ts">
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
// import GlobalCounters from "@/components/sidepanel/GlobalCounters.vue";
// import { assertions, ErrorGroup } from "@/model/assertions"
// import { type Sheet } from "@/model/schedule-sheet";
import MonthlyView from "./MonthlyView.vue";
// import { CountStartingTimes } from "@/model/aggregates";
// import ErrorPanel from "@/components/sidepanel/ErrorList.vue";

// const error_groups = computed(() => props.row.days);
// error_groups(): ErrorGroup[][] {
// 			return this.sheet.schedule.map(row => assertions.map(x => x.evaluate(row)).flat());
// 		},
// start_times(): [number, number[]][] {
// 			return Array.from(CountStartingTimes(this.sheet).entries());
// 		},

// sheet(): Sheet {
// 	return this.$store.state.sheets.sheet;
// },

function resized() {
	// this.$refs.monthly.onPaneResized();
}
</script>

<template>
	<splitpanes class="default-theme panes" @resized="resized">
		<pane min-size="50">
			<!-- :error_groups="error_groups" :start_times="start_times" -->
			<monthly-view></monthly-view>
		</pane>

		<pane size="20">
			<splitpanes horizontal>
				<pane>
					<!-- <global-counters v-if="start_times.length > 0" :start_times="start_times" /> -->
					<div class="placeholder text-center mt-2 overline">
						<v-icon>mdi-calendar-clock</v-icon>
						Napra lebontás itt fog megjelenni
					</div>
				</pane>
				<pane>
					<div class="placeholder text-center mt-2 overline">
						<v-icon>mdi-alert-box</v-icon>
						Hibák és figyelmeztetések itt fognak megjelenni
					</div>

					<!-- <error-panel :error_groups="error_groups"></error-panel> -->
				</pane>
			</splitpanes>
		</pane>
	</splitpanes>
</template>

<style scoped>
.panes {
	height: calc(100vh - 64px);
}
.placeholder {
	overflow: hidden;
	margin: 1em;
	min-width: 12em;
}
</style>

<style lang="scss">
.table {
	position: relative;
	border-collapse: separate;
	table-layout: fixed;
	user-select: none;
	border-spacing: 0;

	thead th {
		position: sticky;
		top: 0;
		background: #000;
		color: #fff;
		z-index: 1;
		height: 3em;

		&:hover {
			filter: invert(15%);
		}
		&:first-child {
			left: 0;
			z-index: 2;
		}
	}

	tbody th {
		position: sticky;
		left: 0;
		background: #fff;
		border: 1px solid #ccc;
	}
}
a:hover span {
	text-decoration: underline;
}
</style>
