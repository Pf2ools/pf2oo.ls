import staticAdapter from '@sveltejs/adapter-static'
import nodeAdapter from '@sveltejs/adapter-node'
import multiAdapter from '@macfja/svelte-multi-adapter'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: multiAdapter([
			staticAdapter(),
			nodeAdapter()
		]),
	}
};

export default config;
