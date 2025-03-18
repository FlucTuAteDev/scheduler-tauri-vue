import { createApp } from "vue";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify';

// Components
import App from "./App.vue";

// Devtools
import { devtools } from "@vue/devtools";

if (process.env.NODE_ENV === "development") {
	devtools.connect();
}

const vuetify = createVuetify();

createApp(App).use(vuetify).mount("#app");
