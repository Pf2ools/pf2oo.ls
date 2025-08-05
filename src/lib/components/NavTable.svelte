<script lang="ts">
	import type { AvailableDocumentTypes } from "$lib/client/db";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	type Props = {
		docs: DB[AvailableDocumentTypes][];
	};
	const { docs }: Props = $props();

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
			class="hover:bg-amber-500/25"
			class:bg-amber-300={ current }
			class:dark:bg-amber-800={ current }
		>
			{doc.name.primary} - {doc.source.ID}
		</div>
	</a>
{/each}
