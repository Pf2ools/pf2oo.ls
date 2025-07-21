<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	const { children } = $props();

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
					<!-- svelte-ignore a11y_autofocus -->
					<div class="hover:bg-amber-500/25" autofocus={page.params.bg === bg.id}>
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
