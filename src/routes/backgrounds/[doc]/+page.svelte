<script lang="ts">
	import type { backgroundInfer } from "pf2ools-schema";
	import { page } from "$app/state";
	import { db } from "$lib/client/db";
	import { useQueryOne } from "@triplit/svelte";

	const data = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc)));
</script>

{#if data.fetching}
	<p>Loading...</p>
{:else if data.error}
	<p>Error: {data.error.message}</p>
{:else if data.result}
	{@const doc = data.result as backgroundInfer}
	<div>
		{JSON.stringify(doc.data)}
	</div>
{/if}
