import { createApp } from "vue";

// Vuetify
import vuetify from "./plugins/vuetify";

// Components
import App from "./App.vue";

// Devtools
import { devtools } from "@vue/devtools";

import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

if (process.env.NODE_ENV === "development") {
	devtools.connect();
}

createApp(App).use(vuetify).mount("#app");

const update = await check();
if (update) {
	console.log(
		`found update ${update.version} from ${update.date} with notes ${update.body}`,
	);
	let downloaded = 0;
	let contentLength = 0;
	// alternatively we could also call update.download() and update.install() separately
	await update.downloadAndInstall(event => {
		switch (event.event) {
			case "Started":
				contentLength = event.data.contentLength ?? 0;
				console.log(
					`started downloading ${event.data.contentLength} bytes`,
				);
				break;
			case "Progress":
				downloaded += event.data.chunkLength;
				console.log(`downloaded ${downloaded} from ${contentLength}`);
				break;
			case "Finished":
				console.log("download finished");
				break;
		}
	});

	console.log("update installed");
	await relaunch();
}
