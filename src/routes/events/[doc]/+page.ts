import { Database } from "$lib/client/db";
import { event } from "pf2ools-data/bundles/byDatatype/core/event.json";

export async function entries() {
	return event.map((x) => ({ doc: Database.idBuilder(x.name.primary, x.source.ID) }));
}
