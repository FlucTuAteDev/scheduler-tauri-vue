import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
	{ files: ["**/*.{js,mjs,cjs,ts,vue}"] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/essential"],
	{
		files: ["**/*.vue"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	eslintConfigPrettier,
	{
		rules: {
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					fixStyle: "inline-type-imports",
				},
			],
		},
	},
);
