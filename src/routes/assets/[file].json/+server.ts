import { json } from "@sveltejs/kit";
import background from "pf2ools-data/bundles/byDatatype/core/background.json";
import event from "pf2ools-data/bundles/byDatatype/core/event.json";
import source from "pf2ools-data/bundles/byDatatype/core/source.json";

const data: Record<string, object> = {
	background,
	event,
	source,
};

export async function GET({ params }) {
	return json(data[params.file]);
}

export const prerender = true;

export const entries = () => Object.keys(data).map((file) => ({ file }));
