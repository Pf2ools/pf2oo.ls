<script lang="ts">
	import { HTMLRenderer } from "$lib/entryRenderer";
	import { Tooltip } from "@skeletonlabs/skeleton-svelte";

	type Props = {
		doc: DB["background"];
	};
	const { doc }: Props = $props();

	let openState = $state(false);

	const htmlRenderer = new HTMLRenderer();
</script>

{#snippet title()}
	{doc.name.primary}
	{#if doc.name.specifier}
		({doc.name.specifier})
	{/if}
{/snippet}

<article class="pf2e-card p-3 max-h-full flex flex-col size-full">
	<svelte:boundary>
		<header class="text-nowrap">
			{#if !doc.name.aliases}
				<span class="h4 text-ellipsis overflow-hidden max-w-10/12">
					{@render title()}
				</span>
			{:else}
				<Tooltip
					open={openState}
					onOpenChange={(e) => (openState = e.open)}
					positioning={{ placement: "bottom" }}
					triggerBase="h4 text-ellipsis overflow-hidden max-w-10/12"
					contentBase="card preset-filled p-2 px-4 text-sm"
					openDelay={200}
					closeDelay={300}
					closeOnClick={false}
					closeOnPointerDown={false}
					arrow
					arrowClasses="preset-filled"
				>
					{#snippet trigger()}
						{@render title()}
					{/snippet}
					{#snippet content()}
						<p>
							<span class="font-bold">Full Name:</span> {doc.name.primary}
						</p>
						<p>
							<span class="font-bold">{doc.name.aliases?.length === 1 ? "Alias" : "Aliases"}:</span> {doc.name.aliases?.join(", ")}
						</p>
					{/snippet}
				</Tooltip>
				<span class="text-sm align-top">*</span>
			{/if}
			<!-- TODO: Convert to anchor once /sources is up -->
			<span class="anchor inline-block text-xs align-top opacity-75 font-bold font-sans">
				{doc.source.ID}
			</span>
		</header>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<section class="
			flex-grow max-w-full
			prose dark:prose-invert
			prose-p:not-first:indent-8 prose-p:mb-1 prose-p:mt-0
			overflow-y-auto scrollbar-thin
			text-justify
		">
			{#if doc.data?.entries}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html htmlRenderer.render(doc.data.entries)}
			{/if}
		</section>

		{#snippet failed(_, reset)}
			Failed to render {doc.id}. <button class="btn preset-filled-primary-50-950" onclick={reset}>Try again?</button>
		{/snippet}
	</svelte:boundary>
</article>
