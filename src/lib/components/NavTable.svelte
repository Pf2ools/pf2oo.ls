<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	type Props = {
		docs: DB["background"][];
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
		href={resolve(`/${doc.type}s/[doc]`, { doc: doc.id })}
	>
		<!-- svelte-ignore a11y_autofocus -->
		<div
			class="hover:bg-amber-500/25"
			autofocus={current}
			class:bg-amber-300={ current }
			class:dark:bg-amber-800={ current }
		>
			{doc.name.primary} - {doc.source.ID}
		</div>
	</a>
{/each}
