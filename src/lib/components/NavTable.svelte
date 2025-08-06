<script lang="ts" generics="DocType extends AvailableDocumentTypes">
	import type { AvailableDocumentTypes } from "$lib/client/db";
	import type { Snippet } from "svelte";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	type Props = {
		docs: DB[DocType][];
		row?: Snippet<[{ doc: DB[DocType] }]>;
		gridCols?: string;
		navigateOnMount?: boolean;
	};
	// eslint-disable-next-line unused-imports/no-unused-vars
	const { docs, row, gridCols = "grid-cols-2", navigateOnMount = false }: Props = $props();

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

	function popout(event: MouseEvent) {
		if (event.button !== 2) return; // 0 = left, 1 = middle, 2 = right
		event.preventDefault(); // stop context menu
	}

/* TODO: Make it remember your last nav, or else on a refresh you come back to 0.
	onMount(async () => {
		if (navigateOnMount) await goto(resolve(`/${docs[0].type}s/[doc]`, { doc: docs[0].id }));
	}); */
</script>

<svelte:window onkeydown={moveKeys}></svelte:window>

<div class="overflow-y-scroll h-full p-2">
	{#each docs.toSorted((a, b) => a.name.primary.localeCompare(b.name.primary)) as doc (doc.id)}
		{@const current = decodeURIComponent(page.params.doc!) === doc.id}
		<a
			id={doc.id}
			class="hover:bg-amber-500/25"
			oncontextmenu={(ev) => popout(ev)}
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
</div>
