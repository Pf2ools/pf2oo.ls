import { json } from "@sveltejs/kit";
import background from "pf2ools-data/bundles/byDatatype/core/background.json";
import condition from "pf2ools-data/bundles/byDatatype/core/condition.json";
import divineIntercession from "pf2ools-data/bundles/byDatatype/core/divineIntercession.json";
import event from "pf2ools-data/bundles/byDatatype/core/event.json";
import familiarAbility from "pf2ools-data/bundles/byDatatype/core/familiarAbility.json";
import relicGift from "pf2ools-data/bundles/byDatatype/core/relicGift.json";
import skill from "pf2ools-data/bundles/byDatatype/core/skill.json";
import source from "pf2ools-data/bundles/byDatatype/core/source.json";

const data: Record<string, object> = {
	background,
	event,
	source,
	condition,
	divineIntercession,
	familiarAbility,
	relicGift,
	skill,
};

export async function GET({ params }) {
	return json(data[params.file]);
}

export const prerender = true;

export const entries = () => Object.keys(data).map((file) => ({ file }));
