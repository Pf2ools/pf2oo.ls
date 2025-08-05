<script lang="ts">
	import type { backgroundInfer } from "pf2ools-schema";
	import { page } from "$app/state";
	import { db } from "$lib/client/db.js";
	import { isTruthy } from "$lib/utils.js";
	import { useQueryOne } from "@triplit/svelte";

	const { data } = $props();
	let { doc } = $derived(data);

	const live = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc!)));

	$effect(() => {
		if (isTruthy(live.result)) doc = live.result as backgroundInfer;
	});
</script>

<svelte:head>
	{#if doc}
		<title>{doc.name.primary} | pf2ools</title>
		<meta property="title" content="{doc.name.primary} | pf2ools" />
		<!-- TODO: When parser is made, turn this into a plain unformatted string. -->
		<meta
			name="description"
			content={doc.data?.entries[0] as string ?? ""}
		/>
	{/if}
</svelte:head>

<article>
	<svelte:boundary>
		{#if doc}
			<h4 class="h4">
				<span class="inline-block">
					{doc.name.primary}
				</span>
				<!-- TODO: Convert to anchor once /sources is up -->
				<span class="anchor inline-block text-xs align-top opacity-75">
					{doc.source.ID}
				</span>
			</h4>
			<section class="prose dark:prose-invert prose-p:not-first:indent-8 prose-p:mb-2 prose-p:mt-0">
				{#if doc.data?.entries}
					{#each doc.data.entries as entry}
						<p>{entry}</p>
					{/each}
				{/if}
			</section>
		{:else}
			Could not find the doc?!
		{/if}

		{#snippet failed(_, reset)}
			<button onclick={reset}>oops! try again</button>
		{/snippet}
	</svelte:boundary>
</article>
