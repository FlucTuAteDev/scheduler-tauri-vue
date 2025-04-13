import {
	createMemoryHistory,
	createRouter,
	type RouteRecordRaw,
} from "vue-router";

import HomeView from "../views/HomeView.vue";
import SheetsView from "../views/SheetsView.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Editor",
		component: HomeView,
	},
	// {
	// 	path: "/staff",
	// 	name: "Staff",
	// 	component: Staff,
	// },
	{
		path: "/setup",
		name: "Sheet setup",
		component: SheetsView,
	},
	// {
	// 	path: "/settings",
	// 	name: "Settings",
	// 	component: Settings,
	// },
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

export default router;
