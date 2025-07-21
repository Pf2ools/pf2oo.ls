import { json } from "@sveltejs/kit";
import backgrounds from "pf2ools-data/bundles/byDatatype/core/background.json";

export function GET() {
	return json(backgrounds);
}

export const prerender = true;