<script lang="ts">
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQueryOne } from "@triplit/svelte";

	const data = $derived(useQueryOne(db.triplit, db.triplit.query("source").Id(page.params.doc)));
</script>

{#if data.fetching}
	<p>Loading...</p>
{:else if data.error}
	<p>Error: {data.error.message}</p>
{:else if data.result}
	<div>
		{JSON.stringify(data.result)}
	</div>
{/if}
