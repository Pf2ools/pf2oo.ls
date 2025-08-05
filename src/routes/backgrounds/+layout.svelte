<script lang="ts">
	import { browser } from "$app/environment";
	import { db } from "$lib/client/db";
	import NavTable from "$lib/components/NavTable.svelte";
	import { isTruthy } from "$lib/utils.js";
	import { useQuery } from "@triplit/svelte";

	const { children, data } = $props();
	let { docs } = $derived(data);

	const dataType = "background" as const;

	if (browser) db.load(dataType);
	const live = useQuery(db.triplit, db.triplit.query(dataType));
	$effect(() => {
		if (isTruthy(live.results)) docs = live.results as DB["background"][];
	});
</script>

<!-- Vertical 2/3 and 1/3 height on mobile. 1/2 Horizontal on desktop. -->
<div class="h-full container mx-auto grid max-sm:grid-rows-3 sm:grid-cols-2 gap-2">
	<div class="
		border overflow-y-scroll p-2
		max-sm:order-last sm:order-first
		max-sm:row-span-1
	">
		<NavTable {docs}>
			<!--
			{#snippet row({ doc })}
				<div class="basis-1/2 justify-self-start">
					{doc.name.primary}
				</div>
				<div class="basis-1/2 justify-self-end">
					{doc.source.ID}
				</div>
			{/snippet}
			-->
		</NavTable>
	</div>
	<div class="border overflow-y-auto scrollbar-stable-x py-2 sm:py-4 px-2 max-sm:row-span-2">
		{@render children()}
	</div>
</div>
