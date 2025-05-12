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
	...pluginVue.configs["flat/recommended"],
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
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					fixStyle: "inline-type-imports",
				},
			],
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "default",
					format: ["camelCase"],
					leadingUnderscore: "allow",
					trailingUnderscore: "allow",
				},
				{
					selector: "objectLiteralProperty",
					format: null,
				},
				{
					selector: "typeProperty",
					format: null,
					custom: {
						match: true,
						// Camel or kebab case. Needed for vue events
						regex: "^([a-z]+([A-Z0-9]+[a-z0-9]+[A-Za-z0-9]*)*|[a-z0-9]+(-[a-z0-9]+)*)$",
					},
				},
				{
					selector: "enumMember",
					format: ["UPPER_CASE"],
				},
				{
					selector: "import",
					format: ["camelCase", "PascalCase"],
				},

				{
					selector: "variable",
					format: ["camelCase", "UPPER_CASE"],
					leadingUnderscore: "allow",
					trailingUnderscore: "allow",
				},
				{
					selector: "typeLike",
					format: ["PascalCase"],
				},
			],
		},
	},
	{
		rules: {
			"vue/custom-event-name-casing": ["error", "kebab-case"],
			"vue/component-name-in-template-casing": [
				"error",
				"kebab-case",
				{
					registeredComponentsOnly: false,
					ignores: [],
				},
			],
		},
	},
);
