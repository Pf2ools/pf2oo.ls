import antfu from "@antfu/eslint-config";

export default antfu({
	formatters: true,
	svelte: true,
	typescript: true,

	stylistic: {
		indent: "tab",
		quotes: "double",
		semi: true,
	},

	rules: {
		"antfu/if-newline": "off",
		"no-unused-vars": "off",
	},
}, {
	files: ["src/**/*.svelte"],
	rules: {
		"svelte/mustache-spacing": ["error", {
			directiveExpressions: "always",
		}],
		"no-sequences": "off",
	},
});
