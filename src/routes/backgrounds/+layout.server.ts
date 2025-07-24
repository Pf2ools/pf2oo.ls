import { db } from "$lib/client/db";

export async function load({ fetch }) {
	await db.load("background", fetch);
	return {
		docs: await db.triplit.fetch(db.triplit.query("background")),
	};
}
