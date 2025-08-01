import type { backgroundInfer } from "pf2ools-schema";
import { Database, db } from "$lib/client/db";
import { background } from "pf2ools-data/bundles/byDatatype/core/background.json";

export async function entries() {
	return background.map((x) => ({ doc: Database.idBuilder(x.name.primary, x.source.ID) }));
}

let docsLoaded = false;

export async function load({ params, fetch }) {
	if (!docsLoaded) docsLoaded = Boolean(await db.load("background", fetch));
	return {
		doc: await db.triplit.fetchById("background", params.doc) as backgroundInfer,
	};
}
