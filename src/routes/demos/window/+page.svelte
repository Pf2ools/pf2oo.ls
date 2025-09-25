<script lang="ts">
	import type { ContentProps } from "$lib/components/Window.svelte";
	import { windowManager } from "$lib";
	import { SquareDashedTopSolid } from "@lucide/svelte";
	import { FiniteStateMachine } from "runed";

	type StyleStates = "none" | "opaque" | "glass";
	const cardStyle = new FiniteStateMachine<StyleStates, "toggle">("none", {
		none: { toggle: "opaque" }, // from none (default) to opaque
		opaque: { toggle: "glass" }, // from opaque to glass
		glass: { toggle: "none" }, // from glass to none
	});

	function createWindow() {
		windowManager.add({
			window: {
				headerButtons: [
					{
						title: "Toggle Style",
						onclick: () => cardStyle.send("toggle"),
						icon: SquareDashedTopSolid,
					},
				],
				children,
			},
		});
	}
</script>

<button class="btn m-4 preset-filled-primary-500" onclick={createWindow}>Open a new window!</button>

<p>
	There are now {windowManager.windows.size} window(s) open.
</p>
<ul>
	{#each windowManager.windows as [id] (id)}
		<li>{id}</li>
	{/each}
</ul>

{#snippet children({ isResizing, width, height }: ContentProps)}
	<div class="pf2e-card {cardStyle.current} p-2 space-y-2 text-justify h-full">
		<h1 class="font-sans h4 text-center">Check these windows out!</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<p>
			This one is resizeable{#if isResizing}&nbsp;like right now! {:else}!{/if} <span class="font-mono text-sm">({width}px x {height}px)</span>
			{#if cardStyle.current !== "none"}
				And its current style is "{cardStyle.current}."
			{/if}
		</p>
	</div>
{/snippet}
