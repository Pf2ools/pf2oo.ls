<script lang="ts">
	import { db } from "$lib/client/db";
	import { useQuery } from "@triplit/svelte";

	db.load("background");
	const data = useQuery(db.triplit, db.triplit.query("background"));
</script>

{#if data.fetching}
	<p>Loading...</p>
{:else if data.error}
	<p>Error: {data.error.message}</p>
{:else if data.results}
	<div>
		{#each data.results as bg}
			<div>{bg.name.primary}</div>
		{/each}
	</div>
{/if}
