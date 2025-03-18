import { createApp } from "vue";

// Vuetify
import vuetify from "./plugins/vuetify";

// Components
import App from "./App.vue";

// Devtools
import { devtools } from "@vue/devtools";

if (process.env.NODE_ENV === "development") {
	devtools.connect();
}

createApp(App).use(vuetify).mount("#app");
