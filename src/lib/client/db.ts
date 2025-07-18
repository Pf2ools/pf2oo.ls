import { schema } from "$triplit/schema";
// import { browser } from '$app/environment';
// import { PUBLIC_TRIPLIT_URL, PUBLIC_TRIPLIT_TOKEN } from '$env/static/public';
import { TriplitClient } from "@triplit/client";

class Database {
	triplit = new TriplitClient({
		// serverUrl: PUBLIC_TRIPLIT_URL,
		// token: PUBLIC_TRIPLIT_TOKEN,
		autoConnect: false, // browser,
		schema,
		storage: "indexeddb",
	});

	dataKeys = ["background", "source"] as const;
	loadedKeys: Set<typeof this.dataKeys[number]> = new Set();

	constructor() {

	}

	async load(type: typeof this.dataKeys[number]) {
		if (this.loadedKeys.has(type)) return "alreadyLoaded";

		const data = await (await fetch(`/data/bundles/byDatatype/core/${type}.json`)).json();
		// eslint-disable-next-line no-console
		console.log(`Loading ${type} data...`);
		await this.triplit.transact(async (tx) => {
			for (const d of data[type]) {
				await tx.insert(type, {...d, id: `${d.name.primary}_${d.source.ID}`});
			}
		});
		this.loadedKeys.add(type);

		return true;
	}
}

export const db = new Database();
