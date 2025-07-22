<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	const { children } = $props();

	if (browser) db.load("background");
	const data = useQuery(db.triplit, db.triplit.query("background").Include("sourceData"));

	$inspect(data.results?.[0]);
</script>

<div class="grid grid-cols-2 gap-2 h-full">
	<div class="border overflow-y-scroll p-2">
		{#if data.fetching}
			<p>Loading...</p>
		{:else if data.error}
			<p>Error: {data.error.message}</p>
		{:else if data.results}
			<div>
				{#each data.results as bg}
					{@const current = decodeURIComponent(page.params.bg) === bg.id}
					<!-- svelte-ignore a11y_autofocus -->
					<div class="hover:bg-amber-500/25" autofocus={current} class:bg-amber-800={ current }>
						<a href={`/backgrounds/${bg.id}`}>
							{bg.name.primary} - {bg.source.ID} - {bg.sourceData?.title.full}
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="border">
		{@render children()}
	</div>
</div>
