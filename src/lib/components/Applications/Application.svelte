<script lang="ts">
	import type { Application } from "./appClass.svelte";
	import { GripIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";

	const { app }: { app: Application<{}> } = $props();
	// flex flex-col border border-gray-700 bg-gray-800 text-white shadow-lg rounded-md

	const ChildComponent = app.window.children;
	onMount(() => app.onMount(app.element!, app.draggableEl!));

	async function collapse() {
		app.collapsed = true;
	}

	function expand() {
		app.collapsed = false;
	}

	function toggle() {
		app.collapsed ? expand() : collapse();
	}

	// State to manage whether we are currently resizing
	let isResizing = $state(false);
	let initialMouseX = $state(0);
	let initialMouseY = $state(0);
	let initialElemWidth = $state(0);
	let initialElemHeight = $state(0);

	// Function to handle the start of resizing
	function startResize(e: MouseEvent) {
		e.preventDefault();
		isResizing = true;
		initialMouseX = e.clientX;
		initialMouseY = e.clientY;
		initialElemWidth = app.element!.offsetWidth;
		initialElemHeight = app.element!.offsetHeight;
	}

	// Function to handle mouse movement during resize
	function duringResize(e: MouseEvent) {
		if (!app.window.resizeable || !app.draggable) return;
		const container = app.draggable.$scrollContainer
			? (app.draggable.$scrollContainer as HTMLElement).getBoundingClientRect()
			: { width: window.innerWidth, height: window.innerHeight };

		if (isResizing) {
			app.size.width = Math.max(
				100,
				Math.min(
					initialElemWidth + (e.clientX - initialMouseX),
					container.width - app.draggable.containerPadding[0],
				),
			);
			app.size.height = Math.max(
				100,
				Math.min(
					initialElemHeight + (e.clientY - initialMouseY),
					container.height - app.draggable.containerPadding[0],
				),
			);
		}
	}

	// Function to handle the end of resizing
	function endResize() {
		isResizing = false;
	}
</script>

<svelte:window on:mousemove={ duringResize } on:mouseup={ endResize } />

<div
	bind:this={ app.element }
	style:position="absolute"
	style:width={ app.collapsed ? "16rem" : `${app.size.width}px` }
	style:height={ app.collapsed ? "min-content" : `${app.size.height}px` }
	class="z-1 group isolate {app.classes}"
>
	<header
		bind:this={ app.draggableEl } ondblclick={toggle} role="none"
		class={[
			"select-none",
			!app.collapsed && "group-hover:translate-0 group-hover:scale-100 translate-y-full scale-95 transition-transform duration-300 delay-500 group-hover:delay-0",
		]}
	>
		<section
			role="none"
			class="w-full bg-gray-500/80 px-2 flex gap-2"
		>
			<header>
				{app.window.title}
			</header>
			<div class="ml-auto [&>*]:hover:underline flex gap-2">
				{#each app.window.headerButtons || [] as { title, class: classes, onclick, icon: Icon }}
					<button
						class="
							flex gap-0.5 items-center
							hover:text-primary-500 hover:drop-shadow-lg drop-shadow-primary-500
							{classes}
						"
						{onclick}
						ondblclick={(ev) => ev.stopPropagation()}
					>
						{#if Icon}
							<Icon size={16} />
						{/if}
						{title}
					</button>
				{/each}
			</div>
		</section>
	</header>
	{#if !app.collapsed}
		<div class="h-full relative overflow-hidden" transition:slide>
			<main class="h-full relative overflow-auto">
				<svelte:boundary>
					{#if ChildComponent}
						<ChildComponent {...app.props} />
					{:else}
						No content has been set!
					{/if}

					{#snippet failed(_error, _reset)}
						The component errored during rendering.
						<button class="btn preset-filled" onclick={_reset}>try again?</button>
					{/snippet}
				</svelte:boundary>
			</main>
			{#if app.window.resizeable}
				<div
					role="none"
					class="resize-handle absolute right-px bottom-px cursor-nwse-resize"
					onmousedown={startResize}
				>
					<GripIcon size="12"></GripIcon>
				</div>
			{/if}
		</div>
	{/if}
</div>
