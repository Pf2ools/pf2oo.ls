import { db } from "$lib/client/db";

export async function load() {
	return { docs: await db.triplit.fetch(db.triplit.query("background")) };
}
