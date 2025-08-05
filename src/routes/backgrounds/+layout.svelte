<script lang="ts">
	import { browser } from "$app/environment";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { isTruthy } from "$lib/utils.js";
	import { useQuery } from "@triplit/svelte";

	const { children, data } = $props();
	let { docs } = $derived(data);

	const dataType = "background" as const;
	const pageName = "backgrounds" as const;

	if (browser) db.load(dataType);
	const live = useQuery(db.triplit, db.triplit.query(dataType));
	$effect(() => {
		if (isTruthy(live.results)) docs = live.results;
	});

	function moveKeys(event: KeyboardEvent) {
		if (!page.params.doc) return;
		const el = document.getElementById(decodeURIComponent(page.params.doc));
		switch (event.key) {
			case "ArrowDown":
			case "j": {
				const anchor = el?.nextElementSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
			case "ArrowUp":
			case "k": {
				const anchor = el?.previousElementSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
		}
	}
</script>

<svelte:window onkeydown={moveKeys}></svelte:window>

<!-- Vertical 2/3 and 1/3 height on mobile. 1/2 Horizontal on desktop. -->
<div class="grid max-sm:grid-rows-3 sm:grid-cols-2 gap-2 h-full">
	<div class="
		border overflow-y-scroll p-2
		max-sm:order-last sm:order-first
		max-sm:row-span-1
	">
		{#each docs.toSorted((a, b) => a.name.primary.localeCompare(b.name.primary)) as doc (doc.id)}
			{@const current = decodeURIComponent(page.params.doc!) === doc.id}
			<a
				id={doc.id}
				href={resolve(`/${pageName}/[doc]`, { doc: doc.id })}
			>
				<!-- svelte-ignore a11y_autofocus -->
				<div class="hover:bg-amber-500/25" autofocus={current} class:bg-amber-800={ current }>
					{doc.name.primary} - {doc.source.ID}
				</div>
			</a>
		{/each}
	</div>
	<div class="border overflow-y-scroll p-2 max-sm:row-span-2">
		{@render children()}
	</div>
</div>
