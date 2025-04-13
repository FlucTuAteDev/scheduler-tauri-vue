<script setup lang="ts">
const routes = [
	["Munkalapok", "/setup", "mdi-file-document-multiple"],
	["Szerkesztő", "/", "mdi-table-edit"],
	["Dolgozók", "/staff", "mdi-account"],
	["Beállítások", "/settings", "mdi-cog"],
];
</script>
<template>
	<v-app>
		<!-- <update-notification></update-notification>
		<v-snackbar :visibility="snackbarZoom">
			<v-icon class="magnifier" color="white">mdi-magnify</v-icon>
			Nagyítás:
			<br />
			{{ zoomLevel }}%
		</v-snackbar> -->
		<!-- <v-dialog
			v-model="templateNotFound"
			width="500">
			<v-card>
				<v-card-title>
					<v-icon color="error">mdi-alert-outline</v-icon>&nbsp;Hiba
				</v-card-title>
				<v-card-text>
					Az importáláshoz és exportáláshoz szükséges sablonfájl nem található!
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="browse(true)">Tallózás</v-btn>
					<v-btn color="darkgrey" outlined @click="browse(false)">Mégse</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog> -->
		<v-app-bar color="primary">
			<div class="d-flex align-center routes">
				<v-btn
					v-for="[name, route, icon] in routes"
					:key="route"
					outlined
					@click="$router.push(route)"
					:disabled="$router.currentRoute.value.path == route"
				>
					<v-icon class="navbar-icon">{{ icon }}</v-icon>
					{{ name }}
				</v-btn>
			</div>

			<v-spacer></v-spacer>

			<!-- <v-btn fab outlined color="white" x-small @click="toggleDevtools">
				<v-icon>mdi-console-line</v-icon>
			</v-btn> -->
		</v-app-bar>

		<v-main class="view">
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<style scoped>
.routes {
	gap: 15px;
	margin: 10px;
}
.navbar-icon {
	padding-right: 5px;
}
.magnifier {
	font-size: 2vh;
	transition: none;
}
.overline {
	line-height: 0;
}

.not-found-alert {
	position: absolute;
	text-align: center;
	width: 30%;
	left: 0;
	right: 0;
	margin: 2em auto 0 auto;
	z-index: 10;
}
</style>

<style>
html,
body {
	overflow: auto !important;
}
</style>
