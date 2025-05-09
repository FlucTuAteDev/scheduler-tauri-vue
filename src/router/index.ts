import { createMemoryHistory, createRouter, type RouteRecordRaw } from "vue-router";

import SheetsView from "@/views/SheetsView.vue";
import EditorView from "@/views/EditorView.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Editor",
		component: EditorView,
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
