import { db } from "$lib/client/db.js";

export const prerender = true;
export const ssr = false;

export function load({ fetch }) {
	db.loadSources(fetch);
}
