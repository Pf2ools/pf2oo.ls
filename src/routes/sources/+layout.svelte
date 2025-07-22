<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	const { children } = $props();

	const data = useQuery(db.triplit, db.triplit.query("source"));

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
				{#each data.results as doc}
					{@const current = decodeURIComponent(page.params.doc) === doc.id}
					<a
						href={page.route.id?.includes("[doc]")
							? page.route.id.replace("[doc]", doc.id)
							: `${page.route.id}/${doc.id}`}
					>
						<!-- svelte-ignore a11y_autofocus -->
						<div class="hover:bg-amber-500/25" autofocus={current} class:bg-amber-800={ current }>
							{doc.title.full} - {doc.title.short}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
	<div class="border">
		{@render children()}
	</div>
</div>
