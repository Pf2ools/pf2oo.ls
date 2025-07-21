import { browser } from "$app/environment";
import { schema } from "$triplit/schema";
// import { browser } from '$app/environment';
// import { PUBLIC_TRIPLIT_URL, PUBLIC_TRIPLIT_TOKEN } from '$env/static/public';
import { TriplitClient } from "@triplit/client";

export class Database {
	triplit = new TriplitClient({
		// serverUrl: PUBLIC_TRIPLIT_URL,
		// token: PUBLIC_TRIPLIT_TOKEN,
		autoConnect: false, // browser,
		schema,
		storage: browser ? "indexeddb" : "memory",
		/* experimental: {
			onDatabaseInit: console.log,
		}, */
	});

	static idBuilder = (name: string, source: string): string => `${name}_${source}`;

	dataKeys = ["background"] as const;

	constructor() {}

	/**
	 * As .load but specifically for book sources, due to their slightly different schema.
	 */
	async loadSources(fetch: typeof globalThis.fetch = globalThis.fetch) {
		const data = await (await fetch(`/assets/source.json`)).json();
		// eslint-disable-next-line no-console
		console.log(`Loading source data...`);
		await this.triplit.transact(async (tx) => {
			for (const d of data.source) {
				try {
					await tx.insert("source", { ...d, id: d.ID });
				}
				catch (_) {
					console.error(_, d);
				}
			}
		});

		return true;
	}

	/**
	 * Loads a specific type of item from a bundled JSON file.
	 */
	async load(type: typeof this.dataKeys[number], fetch: typeof globalThis.fetch = globalThis.fetch) {
		const data = await (await fetch(`/assets/${type}.json`)).json();
		// eslint-disable-next-line no-console
		console.log(`Loading ${type} data...`);
		await this.triplit.transact(async (tx) => {
			for (const d of data[type]) {
				try {
					await tx.insert(type, { ...d, id: Database.idBuilder(d.name.primary, d.source.ID) });
				}
				catch (_) {
					console.error(_, d);
				}
			}
		});

		return true;
	}
}

const db = new Database();

export { db };
