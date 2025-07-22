import { source } from "pf2ools-data/bundles/byDatatype/core/source.json";

export async function entries() {
	return source.map((x) => ({ doc: x.ID }));
}
