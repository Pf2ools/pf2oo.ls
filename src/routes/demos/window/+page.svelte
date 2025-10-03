<script lang="ts">
	import { windowManager } from "$lib";
	import { Application } from "$lib/components/Applications/appClass.svelte";
	import Card from "./Card.svelte";

	function randomScreenPosition() {
		return {
			x: Math.floor(Math.random() * ((globalThis?.innerWidth || 500) - 400)),
			y: Math.floor(Math.random() * ((globalThis?.innerHeight || 400) - 300)),
		};
	}

	let x = $state(randomScreenPosition().x);
	let y = $state(randomScreenPosition().y);

	function createWindow() {
		new Application({ window: { children: Card }, position: { x, y } }).render();
		x = randomScreenPosition().x;
		y = randomScreenPosition().y;
	}
</script>

<div class="grid grid-cols-2">
	<div>
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
	</div>
	<div>
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
	</div>
</div>
