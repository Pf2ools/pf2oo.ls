<script lang="ts">
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	db.load("background");
	const data = useQuery(db.triplit, db.triplit.query("background"));

	$inspect(data.results?.[0]);
</script>

{#if data.fetching}
	<p>Loading...</p>
{:else if data.error}
	<p>Error: {data.error.message}</p>
{:else if data.results}
	<div>
		{#each data.results as bg}
			<div>{bg.name.primary} - {bg.source.ID}</div>
		{/each}
	</div>
{/if}
