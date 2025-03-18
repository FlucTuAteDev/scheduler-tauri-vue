import { createApp } from "vue";
import App from "./App.vue";
import { devtools } from "@vue/devtools";

if (process.env.NODE_ENV === "development") {
	devtools.connect();
}

createApp(App).mount("#app");
