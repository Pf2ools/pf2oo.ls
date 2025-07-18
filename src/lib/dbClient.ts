import { schema } from "$triplit/schema";
// import { browser } from '$app/environment';
// import { PUBLIC_TRIPLIT_URL, PUBLIC_TRIPLIT_TOKEN } from '$env/static/public';
import { TriplitClient } from "@triplit/client";

export const client = new TriplitClient({
	// serverUrl: PUBLIC_TRIPLIT_URL,
	// token: PUBLIC_TRIPLIT_TOKEN,
	autoConnect: false, // browser,
	schema,
	storage: "indexeddb",
});
