import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default createVuetify({
	icons: {
		defaultSet: "mdi", // This is already the default value - only for display purposes
		aliases,
		sets: {
			mdi,
		},
	},
});
