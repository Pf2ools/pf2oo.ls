import { db } from "$lib/client/db";

let docsLoaded = false;

export async function load({ fetch }) {
	if (!docsLoaded) docsLoaded = Boolean(await db.load("background", fetch));
	return {
		docs: await db.triplit.fetch(db.triplit.query("background")),
	};
}
