import { createMemoryHistory, createRouter, type RouteRecordRaw } from "vue-router";

import SheetsView from "@/views/SheetsView.vue";
import MonthlyView from "@/views/MonthlyView.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Editor",
		component: MonthlyView,
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
