<script lang="ts" generics="DocType extends AvailableDocumentTypes">
	import type { AvailableDocumentTypes } from "$lib/client/db";
	import type { Snippet } from "svelte";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { Search } from "@lucide/svelte";
	import { TableHandler } from "@vincjo/datatables";

	type Props = {
		docs: DB[DocType][];
		row?: Snippet<[{ doc: DB[DocType] }]>;
		gridCols?: string;
		navigateOnMount?: boolean;
	};
	// eslint-disable-next-line unused-imports/no-unused-vars
	const { docs, row, gridCols = "grid-cols-2", navigateOnMount = false }: Props = $props();
	const table = new TableHandler(docs, { selectBy: "id" });

	function moveKeys(event: KeyboardEvent) {
		// Don't move if focused on an input or textarea
		if (
			["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement).tagName)
			|| event.metaKey
			|| event.ctrlKey
			|| event.altKey
		) {
			return;
		}
		// Don't move if no doc is selected
		if (!page.params.doc) return;
		// Find the current element and move to next/previous
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

	// TODO:
	function popout(event: MouseEvent) {
		if (event.button !== 2) return; // 0 = left, 1 = middle, 2 = right
		event.preventDefault(); // stop context menu
	}

	const search = table.createSearch();
</script>

<svelte:window onkeydown={moveKeys}></svelte:window>

<div class="flex border-b border-solid border-primary-300/33">
	<button class="btn-icon"><Search size={20}></Search></button>
	<input
		class="input rounded-none text-sm"
		placeholder="Search..." type="search"
		bind:value={ search.value } oninput={() => search.set()}
	/>
</div>

<div class="overflow-y-scroll h-full p-2">
	{#each table.rows as doc (doc.id)}
		{@const current = decodeURIComponent(page.params.doc!) === doc.id}
		<a
			id={doc.id}
			class="hover:bg-amber-500/25 last:[&>*]:border-b-0"
			oncontextmenu={(ev) => popout(ev)}
			href={resolve(`/${doc.type}s/[doc]`, { doc: doc.id })}
		>
			<div
				class="hover:bg-amber-500/25 grid border-b border-solid border-primary-300/33 {gridCols}"
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
