/* eslint-disable node/prefer-global/process */
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
import "dotenv/config";

export default defineConfig(({ mode }) => {
	if (mode === "build") console.log(`Building for ${process.env.BUILD_STATIC ? "STATIC" : "NODE"}`);
	return {
		server: {
			fs: { allow: ["./triplit"] },
			open: true,
			warmup: {
				clientFiles: [
					"./src/lib/client/db.ts",
					"@lucide/svelte",
				],
				ssrFiles: [
					"./src/routes/+layout.server.ts",
				],
			},
		},
		plugins: [
			lucidePreprocess(),
			tailwindcss(),
			sveltekit(),
			devtoolsJson(),
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/lib/paraglide",
				strategy: ["cookie", "baseLocale"],
			}),
		],
		test: {
			projects: [
				{
					extends: "./vite.config.ts",
					test: {
						name: "client",
						environment: "browser",
						browser: {
							enabled: true,
							provider: "playwright",
							instances: [{ browser: "chromium" }],
						},
						include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
						exclude: ["src/lib/server/**"],
						setupFiles: ["./vitest-setup-client.ts"],
					},
				},
				{
					extends: "./vite.config.ts",
					test: {
						name: "server",
						environment: "node",
						include: ["src/**/*.{test,spec}.{js,ts}"],
						exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					},
				},
			],
		},
	};
});
