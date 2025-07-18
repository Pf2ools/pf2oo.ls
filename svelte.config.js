import multiAdapter from "@macfja/svelte-multi-adapter";
import nodeAdapter from "@sveltejs/adapter-node";
import staticAdapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	compilerOptions: {
		modernAst: true,
		discloseVersion: true,
		runes: true,
		experimental: {
			async: true,
		},
	},

	kit: {
		alias: {
			$triplit: "triplit/*",
		},
		adapter: multiAdapter([
			staticAdapter({}),
			nodeAdapter({ out: "build/_node" }),
		]),
	},
};

export default config;
