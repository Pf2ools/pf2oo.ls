<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db.js";
	import Background from "$lib/components/Background.svelte";
	import { isTruthy } from "$lib/utils.js";
	import { useQueryOne } from "@triplit/svelte";

	const { data } = $props();
	let { doc } = $derived(data);

	const live = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc!)));

	$effect(() => {
		if (isTruthy(live.result)) doc = live.result as DB["background"];
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

{#if doc}
	<Background {doc} />
{:else}
	Could not find the doc?!
{/if}
