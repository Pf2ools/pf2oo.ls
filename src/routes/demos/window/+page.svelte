<script lang="ts">
	import Window from "$lib/components/Window.svelte";
	import { SquareDashedTopSolid } from "@lucide/svelte";
	import { FiniteStateMachine } from "runed";

	type StyleStates = "none" | "opaque" | "glass";
	const cardStyle = new FiniteStateMachine<StyleStates, "toggle">("none", {
		opaque: { toggle: "glass" },
		glass: { toggle: "none" },
		none: { toggle: "opaque" },
	});
</script>

<Window
	headerButtons={[
		{
			title: "Toggle Style",
			onclick: () => cardStyle.send("toggle"),
			icon: SquareDashedTopSolid,
		},
	]}
>
	<div class="pf2e-card {cardStyle.current} p-2 space-y-2 text-justify h-full">
		<h1 class="font-sans h4 text-center">Check these windows out!</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<p>
			This one is resizeable!
			{#if cardStyle.current !== "none"}
				And its current style is "{cardStyle.current}."
			{/if}
		</p>
	</div>
</Window>

<Window resizeable={false} classes="right-0">
	<div class="pf2e-card p-2 space-y-2 text-justify h-full">
		<h1 class="font-sans h4 text-center">Welcome to pf2ools!</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<p>
			This website is a work in progress. What it once aims to do is be an all-encompassing wiki for all things to do with the Pathfinder 2e ruleset. Much akin to <a class="anchor" target="_blank" href="https://2e.aonprd.com/">Archives of Nethys</a>. But newer, more modern. <span class="text-xs opacity-15">Maybe even a character sheet one day.</span>
		</p>
	</div>
</Window>
