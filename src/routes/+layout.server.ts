import { db } from "$lib/client/db";

/* === Prerendering === */
// TODO: Make this optional? If this is taking a lot of memory on node servers.
let loadedSources = false;
export async function load({ fetch }) {
	if (loadedSources) return;
	await db.loadAll(fetch);
	loadedSources = true;
}
