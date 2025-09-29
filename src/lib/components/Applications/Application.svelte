<script lang="ts">
	import type { Application } from "./appClass.svelte";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";

	const { app }: { app: Application } = $props();
	// flex flex-col border border-gray-700 bg-gray-800 text-white shadow-lg rounded-md

	onMount(() => app.onMount(app.element!, app.draggableEl!));

	let collapsed = $state(false);

	async function collapse() {
		collapsed = true;
	}

	function expand() {
		collapsed = false;
	}

	function toggle() {
		collapsed ? expand() : collapse();
	}
</script>

<div
	bind:this={ app.element }
	style:position="absolute"
	style:width={ collapsed ? "16rem" : `${app.size.width}px` }
	style:height={ collapsed ? "min-content" : `${app.size.height}px` }
	class={app.classes}
>
	<header class="select-none" bind:this={ app.draggableEl } ondblclick={toggle} role="none">
		<section
			role="none"
			class="w-full bg-gray-500 px-2 flex gap-2"
		>
			<header>
				drag me! {collapsed ? "(closed)" : ""}
			</header>
		</section>
	</header>
	{#if !collapsed}
		<div class="h-full relative overflow-hidden" transition:slide>
			<main class="h-full relative overflow-auto">
				{#if app.window.children}
					{@render app.window.children(app)}
				{:else}
					No content has been set!
				{/if}
			</main>
		</div>
	{/if}
</div>
