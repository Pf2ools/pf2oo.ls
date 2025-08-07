<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db.js";
	import Background from "$lib/components/Background.svelte";
	import { isTruthy } from "$lib/utils.js";
	import { Tabs } from "@skeletonlabs/skeleton-svelte";
	import { useQueryOne } from "@triplit/svelte";

	const { data } = $props();
	let { doc } = $derived(data);

	const live = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc!)));

	$effect(() => {
		if (isTruthy(live.result)) doc = live.result as DB["background"];
	});

	let group = $state("doc");
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

<Tabs
	value={group} onValueChange={(e) => (group = e.value)}
	listMargin=""
	contentClasses="overflow-y-hidden"
	classes="h-full flex flex-col"
	listGap=""
>
	{#snippet list()}
		<Tabs.Control
			value="doc"
			classes="pb-px!"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Background
		</Tabs.Control>
		<Tabs.Control
			value="rules"
			disabled
			classes="pb-px!"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Quick Rules
		</Tabs.Control>
		<Tabs.Control
			value="images"
			disabled
			classes="pb-px!"
			labelClasses="p-1 px-3 rounded-none rounded-t-base"
		>
			Images
		</Tabs.Control>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="doc" classes="h-full">
			{#if doc}
				<Background {doc} />
			{:else}
				Could not find the doc?!
			{/if}
		</Tabs.Panel>
	{/snippet}
</Tabs>
