<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db.js";
	import { Application } from "$lib/components/Applications/appClass.svelte.js";
	import Background from "$lib/components/Background.svelte";
	import BackgroundForm from "$lib/components/BackgroundForm.svelte";
	import { isTruthy } from "$lib/utils.js";
	import { EllipsisVertical, ExternalLinkIcon } from "@lucide/svelte";
	import { Popover, Tabs } from "@skeletonlabs/skeleton-svelte";
	import { useQueryOne } from "@triplit/svelte";

	const { data } = $props();
	let { doc } = $derived(data);

	const live = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc!)));

	$effect(() => {
		if (isTruthy(live.result)) doc = live.result as DB["background"];
	});

	type Tabs = "doc" | "new";
	let group: Tabs = $state("doc");
	let openState = $state(false);
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

{#snippet children()}
	{#if doc}
		<Background {doc} />
	{:else}
		Could not find the doc?!
	{/if}
{/snippet}

<Tabs
	value={group} onValueChange={(e) => (group = e.value as Tabs)}
	listMargin="pl-0.5"
	contentClasses="overflow-y-hidden"
	classes="h-full flex flex-col"
	listGap=""
>
	{#snippet list()}
		<Tabs.Control
			value="doc"
			padding="pb-px"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Background
		</Tabs.Control>
		<Tabs.Control
			value="rules"
			disabled
			padding="pb-px"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Quick Rules
		</Tabs.Control>
		<Tabs.Control
			value="images"
			disabled
			padding="pb-px"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Images
		</Tabs.Control>
		<button
			class="ml-auto flex pf2e-card rounded-none rounded-t-base mb-0.5 p-1 align-middle items-center"
			onclick={() => {
				const copyDoc = $state.snapshot(doc);
				new Application({
					props: { doc: copyDoc },
					window: {
						title: copyDoc.name.primary,
						children: Background,
					},
					size: { width: 600, height: "min-content" },
				}).render();
			}}
		>
			<ExternalLinkIcon size={20} class="inline opacity-50 hover:opacity-100" />
		</button>
		<Popover
			open={openState}
			onOpenChange={(e) => (openState = e.open)}
			positioning={{ placement: "bottom-end", offset: { mainAxis: 0 } }}
			classes="flex pf2e-card rounded-none rounded-t-base mb-0.5"
			triggerBase="p-1 opacity-50 hover:opacity-100"
			contentBase="pf2e-card rounded-xs p-2 px-4 text-sm drop-shadow-md"
			arrow
			arrowClasses="border-t border-l border-surface-400-600"
			arrowBackground="var(--color-surface-100-900)"
		>
			{#snippet trigger()}
				<EllipsisVertical size={20}></EllipsisVertical>
			{/snippet}
			{#snippet content()}
				Hello
			{/snippet}
		</Popover>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="doc" classes="h-full flex flex-col gap-2 items-center">
			{@render children()}
			<button
				class="btn preset-filled-success-100-900 btn-sm w-min"
				onclick={() => (group = "new")}
			>
				Create New
			</button>
		</Tabs.Panel>
		<Tabs.Panel value="new" classes="h-full flex flex-col gap-2 items-center">
			<BackgroundForm />
			<button
				class="btn preset-filled-warning-50-950 btn-sm w-min"
				onclick={() => (group = "doc")}
			>
				Go Back
			</button>
		</Tabs.Panel>
	{/snippet}
</Tabs>
