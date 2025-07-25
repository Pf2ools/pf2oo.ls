<script lang="ts">
	import type { backgroundInfer } from "pf2ools-schema";
	import { page } from "$app/state";
	import { db } from "$lib/client/db.js";
	import { useQueryOne } from "@triplit/svelte";

	const { data } = $props();
	let { doc } = $derived(data);

	const live = $derived(useQueryOne(db.triplit, db.triplit.query("background").Id(page.params.doc!)));

	$effect(() => {
		if (live.result) doc = live.result as backgroundInfer;
	});
</script>

<article>
	<h1>{doc.name.primary}</h1>
	<section>{JSON.stringify(doc.data)}</section>
	<footer>{doc.source.ID}</footer>
</article>
