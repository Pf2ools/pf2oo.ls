<script lang="ts">
	import type { Application } from "$lib/components/Applications/appClass.svelte";
	import { FiniteStateMachine } from "runed";

	const { app }: { app: Application<{}> } = $props();

	type StyleStates = "none" | "opaque" | "glass";
	const cardStyle = new FiniteStateMachine<StyleStates, "toggle">("none", {
		none: { toggle: "opaque" }, // from none (default) to opaque
		opaque: { toggle: "glass" }, // from opaque to glass
		glass: { toggle: "none" }, // from glass to none
	});
</script>

<div class="pf2e-card {cardStyle.current} p-2 space-y-2 text-justify h-full">
	<h1 class="font-sans h4 text-center">Check these windows out!</h1>
	<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
	<button class="btn preset-filled" onclick={() => cardStyle.send("toggle")}> Change Style </button>
	<p>
		Size: <span class="font-mono text-sm">({app.size.width}px x {app.size.height}px)</span>
		<br />
		Position: <span class="font-mono text-sm">({app.x}px x {app.y}px)</span>
		{#if cardStyle.current !== "none"}
			<br />
			And its current style is "{cardStyle.current}."
		{/if}
	</p>
</div>
