import type { Database } from "$lib/client/db";
import { browser, building } from "$app/environment";
import { db } from "$lib/client/db";

/* === Options === */
export const ssr = true;
export const prerender = true;
// export const trailingSlash = "always";

/* === Prerendering === */
let loadedSources = false;
export async function load({ fetch }) {
	if (building) {
		if (loadedSources) return;
		await db.loadAll(fetch);
		loadedSources = true;
	}
}

/* === Globals === */
if (browser) {
	window.pf2ools = {
		database: db,
		get db() { return this.database; },
	};
}

declare global {
	interface Window {
		pf2ools: {
			database: Database;
			db: Database;
		};
	}
}
