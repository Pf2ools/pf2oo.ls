import { Database, db } from "$lib/client/db";
import { background } from "pf2ools-data/bundles/byDatatype/core/background.json";

export async function entries() {
	return background.map((x) => ({ doc: Database.idBuilder(x.name.primary, x.source.ID) }));
}

export async function load({ params }) {
	return { doc: await db.triplit.fetchById("background", params.doc) as DB["background"] };
}

export const prerender = "auto";
