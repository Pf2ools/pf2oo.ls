import { json } from "@sveltejs/kit";
import sources from "pf2ools-data/bundles/byDatatype/core/source.json";

export function GET() {
	return json(sources);
}

export const prerender = true;
