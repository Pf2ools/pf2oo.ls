<script lang="ts" generics="DocType extends AvailableDocumentTypes">
	import type { AvailableDocumentTypes } from "$lib/client/db";
	import type { Snippet } from "svelte";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	type Props = {
		docs: DB[DocType][];
		row?: Snippet<[{ doc: DB[DocType] }]>;
		gridCols?: string;
	};
	const { docs, row, gridCols = "grid-cols-2" }: Props = $props();

	function moveKeys(event: KeyboardEvent) {
		if (!page.params.doc) return;
		const el = document.getElementById(decodeURIComponent(page.params.doc));
		switch (event.key) {
			case "ArrowDown":
			case "j": {
				const anchor = el?.nextElementSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
			case "ArrowUp":
			case "k": {
				const anchor = el?.previousElementSibling as HTMLAnchorElement;
				event.preventDefault();
				anchor?.click();
				anchor?.scrollIntoView({ behavior: "auto", block: "center" });
				break;
			}
		}
	}
</script>

<svelte:window onkeydown={moveKeys}></svelte:window>

{#each docs.toSorted((a, b) => a.name.primary.localeCompare(b.name.primary)) as doc (doc.id)}
	{@const current = decodeURIComponent(page.params.doc!) === doc.id}
	<a
		id={doc.id}
		class="hover:bg-amber-500/25"
		href={resolve(`/${doc.type}s/[doc]`, { doc: doc.id })}
	>
		<div
			class="hover:bg-amber-500/25 grid {gridCols}"
			class:bg-amber-300={ current }
			class:dark:bg-amber-800={ current }
		>
			{#if row}
				{@render row({ doc })}
			{:else}
				<div class="basis-1/2 justify-self-start">
					{doc.name.primary}
				</div>
				<div class="basis-1/2 justify-self-end">
					{doc.source.ID}
				</div>
			{/if}
		</div>
	</a>
{/each}
