<script lang="ts">
	import { windowManager } from "$lib";
	import { Application } from "$lib/components/Applications/appClass.svelte";
	import { FiniteStateMachine } from "runed";

	type StyleStates = "none" | "opaque" | "glass";
	const cardStyle = new FiniteStateMachine<StyleStates, "toggle">("none", {
		none: { toggle: "opaque" }, // from none (default) to opaque
		opaque: { toggle: "glass" }, // from opaque to glass
		glass: { toggle: "none" }, // from glass to none
	});

	function randomScreenPosition() {
		return {
			x: Math.floor(Math.random() * ((globalThis?.innerWidth || 500) - 400)),
			y: Math.floor(Math.random() * ((globalThis?.innerHeight || 400) - 300)),
		};
	}

	let x = $state(randomScreenPosition().x);
	let y = $state(randomScreenPosition().y);

	function createWindow() {
		new Application({ window: { children }, position: { x, y } }).render();
		x = randomScreenPosition().x;
		y = randomScreenPosition().y;
	}
</script>

<button class="btn m-4 preset-filled-primary-500" onclick={createWindow}>Open a new window!</button>

<div class="w-64 flex flex-col gap-2 items-center">
	<label class="input-group grid-cols-[auto_1fr_auto]">
		<div class="ig-cell">X Position</div>
		<input type="number" bind:value={ x } class="ig-input m-4 w-20" placeholder="X position" />
	</label>
	<label class="input-group grid-cols-[auto_1fr_auto]">
		<div class="ig-cell">Y Position</div>
		<input type="number" bind:value={ y } class="ig-input m-4 w-20" placeholder="Y position" />
	</label>
</div>

<span>
	Tip: Press <code class="code">Escape</code> to close the last opened window.
	<p></p>
	<code class="code">Shift + Escape</code> to close all windows.
</span>
<p>
	There are now <code class="code">{windowManager.apps.size}</code> window(s) open.
</p>
<ul>
	{#each windowManager.apps as [id] (id)}
		<li>{id}</li>
	{/each}
</ul>

{#snippet children(app: Application)}
	<div class="pf2e-card {cardStyle.current} p-2 space-y-2 text-justify h-full">
		<h1 class="font-sans h4 text-center">Check these windows out!</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<p>
			Size: <span class="font-mono text-sm">({app.size.width}px x {app.size.height}px)</span>
			<br />
			Position: <span class="font-mono text-sm">({app.position.x}px x {app.position.y}px)</span>
			{#if cardStyle.current !== "none"}
				And its current style is "{cardStyle.current}."
			{/if}
		</p>
	</div>
{/snippet}
