<script lang="ts">
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	const { children, data } = $props();
	let { docs } = $derived(data);

	if (browser) db.load("background");
	const live = useQuery(db.triplit, db.triplit.query("background"));
	$effect(() => {
		if (live.results) docs = live.results;
	});

	function moveKeys(event: KeyboardEvent) {
		const el = document.getElementById(decodeURIComponent(page.params.doc));
		switch (event.key) {
			case "ArrowDown":
			case "j":{
				const anchor = el?.nextSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
			case "ArrowUp":
			case "k": {
				const anchor = el?.previousSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
		}
	}
</script>

<svelte:window onkeydown={moveKeys}></svelte:window>

<div class="grid grid-cols-2 gap-2 h-full">
	<div class="border overflow-y-scroll p-2">
		<div>
			{#each docs as doc (doc.id)}
				{@const current = decodeURIComponent(page.params.doc) === doc.id}
				<a
					id={doc.id}
					href={page.route.id?.includes("[doc]")
						? `${base}/${page.route.id?.replace("[doc]", doc.id)}`
						: `${base}/${page.route.id}/${doc.id}`}
				>
					<!-- svelte-ignore a11y_autofocus -->
					<div class="hover:bg-amber-500/25" autofocus={current} class:bg-amber-800={ current }>
						{doc.name.primary} - {doc.source.ID}
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div class="border overflow-y-scroll p-2">
		{@render children()}
	</div>
</div>
