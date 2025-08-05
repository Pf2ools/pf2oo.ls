<script lang="ts">
	import { Tooltip } from "@skeletonlabs/skeleton-svelte";

	type Props = {
		doc: DB["background"];
	};
	const { doc }: Props = $props();

	let openState = $state(false);
</script>

{#snippet title()}
	{doc.name.primary}
	{#if doc.name.specifier}
		({doc.name.specifier})
	{/if}
{/snippet}

<svelte:boundary>
	<header>
		{#if !doc.name.aliases}
			<span class="h4">
				{@render title()}
			</span>
		{:else}
			<Tooltip
				open={openState}
				onOpenChange={(e) => (openState = e.open)}
				positioning={{ placement: "bottom" }}
				triggerBase="h4"
				contentBase="card preset-filled p-2 px-4 text-sm"
				openDelay={200}
				closeDelay={300}
				closeOnClick={false}
				closeOnPointerDown={false}
				arrow
				arrowClasses="preset-filled"
			>
				{#snippet trigger()}
					{@render title()}<span class="text-sm align-top">*</span>
				{/snippet}
				{#snippet content()}
					This {doc.type} also has the following {doc.name.aliases?.length === 1 ? "alias" : "aliases"}: {doc.name.aliases?.join(", ")}
				{/snippet}
			</Tooltip>
		{/if}
		<!-- TODO: Convert to anchor once /sources is up -->
		<span class="anchor inline-block text-xs align-top opacity-75 font-bold">
			{doc.source.ID}
		</span>
	</header>
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
