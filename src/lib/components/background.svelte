<script lang="ts">
	type Props = {
		doc: DB["background"];
	};
	const { doc }: Props = $props();
</script>

<svelte:boundary>
	<h4 class="h4">
		<span class="inline-block">
			{doc.name.primary}
		</span>
		<!-- TODO: Convert to anchor once /sources is up -->
		<span class="anchor inline-block text-xs align-top opacity-75">
			{doc.source.ID}
		</span>
	</h4>
	<section class="prose max-w-full dark:prose-invert prose-p:not-first:indent-8 prose-p:mb-1 prose-p:mt-0 text-justify">
		{#if doc.data?.entries}
			{#each doc.data.entries as entry}
				<p>{entry}</p>
			{/each}
		{/if}
	</section>

	{#snippet failed(_, reset)}
		<button onclick={reset}>Failed to render {doc.id}</button>
	{/snippet}
</svelte:boundary>
