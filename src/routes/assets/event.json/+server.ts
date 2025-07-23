import { json } from "@sveltejs/kit";
import events from "pf2ools-data/bundles/byDatatype/core/event.json";

export function GET() {
	return json(events);
}

export const prerender = true;
