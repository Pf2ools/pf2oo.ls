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

<article>
	<svelte:boundary>
		{#if doc}
			<h4 class="h4">
				<span class="inline-block">
					{doc.name.primary}
				</span>
				<a href="/sources/{doc.source.ID}" class="anchor inline-block text-xs align-top opacity-75">
					{doc.source.ID}
				</a>
			</h4>
			<section class="prose prose-invert prose-p:not-first:indent-8 prose-p:mb-2 prose-p:mt-0">
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
