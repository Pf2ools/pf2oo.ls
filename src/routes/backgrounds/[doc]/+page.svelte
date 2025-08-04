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
	<svelte:boundary onerror={handler}>
		{#if doc}
			<h1>{doc.name.primary}</h1>
			<section>{JSON.stringify(doc.data)}</section>
			<footer>{doc.source.ID}</footer>
		{:else}
			Could not find!
		{/if}

		{#snippet failed(_, reset)}
			<button onclick={reset}>oops! try again</button>
		{/snippet}
	</svelte:boundary>
</article>
