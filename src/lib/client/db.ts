import { browser } from "$app/environment";
import { resolve } from "$app/paths";
import { schema } from "$triplit/schema";
// import { browser } from '$app/environment';
// import { PUBLIC_TRIPLIT_URL, PUBLIC_TRIPLIT_TOKEN } from '$env/static/public';
import { TriplitClient } from "@triplit/client";
import { useDebounce } from "runed";

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

	debounceDuration = 3000;

	static idBuilder = (name: string | { primary: string; specifier: string }, source: string): string =>
		typeof name === "string"
			? `${name}_${source}`
			: `${name.primary}${name.specifier ? `_${name.specifier}` : ""}_${source}`;

	static dataKeys = [
		"background",
		// "condition",
		// "domain",
		"event",
		// "familiarAbility",
		// "relicGift",
		// "skill",
	] as const;

	constructor() {}

	/**
	 * As .load but specifically for book sources, due to their slightly different schema.
	 */
	loadSources = useDebounce(this.#loadSources, this.debounceDuration);

	/**
	 * As .load but specifically for book sources, due to their slightly different schema.
	 */
	async #loadSources(fetch: typeof globalThis.fetch = globalThis.fetch) {
		const data = await (await fetch(resolve(`/assets/source.json`))).json();
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
	load = useDebounce(this.#load, 500);

	/**
	 * Loads a specific type of item from a bundled JSON file.
	 */
	async #load(type: typeof Database.dataKeys[number], fetch: typeof globalThis.fetch = globalThis.fetch) {
		const data = await (await fetch(resolve(`/assets/${type}.json`))).json();
		// eslint-disable-next-line no-console
		console.log(`Loading ${type} data...`);
		await this.triplit.transact(async (tx) => {
			for (const d of data[type]) {
				try {
					await tx.insert(type, { ...d, id: Database.idBuilder(d.name, d.source.ID) });
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

if (browser) db.loadSources(fetch);

export { db };
