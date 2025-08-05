/* eslint-disable node/prefer-global/process */
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
		preserveComments: true,
		experimental: {
			async: true,
		},
	},

	kit: {
		prerender: {
			concurrency: 4,
		},
		router: {
			type: "pathname",
			resolution: "client",
		},
		alias: {
			$triplit: "triplit/*",
		},
		adapter: process.env.BUILD_STATIC
			? staticAdapter({ fallback: "404.html" })
			: nodeAdapter({ out: "build/_node" }),
		paths: {
			base: process.argv.includes("dev") ? "" : process.env.BASE_PATH,
		},
	},
};

export default config;
