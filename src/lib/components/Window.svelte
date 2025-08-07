<script lang="ts">
	import type { DraggableParams } from "animejs";
	import type { Snippet } from "svelte";
	import { GripIcon } from "@lucide/svelte";
	import { createDraggable } from "animejs";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";

	type Props = {
		children: Snippet<[]>;
		drag?: Snippet<[{ collapsed: boolean }]>;
		draggableOptions?: DraggableParams;
		classes?: string;
	};
	const { children, drag, draggableOptions, classes }: Props = $props();

	let target: HTMLElement | undefined;

	onMount(() => {
		if (!target) throw new Error("Somehow, there is no target to make draggable.");
		createDraggable(target, {
			trigger: ".drag-handle",
			container: "body",
			containerPadding: [8, 8, 8, 8],
			containerFriction: 1,
			velocityMultiplier: 0.2,
			...draggableOptions,
		});
	});

	let width = $state() as number;
	let height = $state() as number;
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
		initialElemWidth = target!.offsetWidth;
		initialElemHeight = target!.offsetHeight;
	}

	// Function to handle mouse movement during resize
	function duringResize(e: MouseEvent) {
		if (isResizing) {
			width = initialElemWidth + (e.clientX - initialMouseX);
			height = initialElemHeight + (e.clientY - initialMouseY);
		}
	}

	// Function to handle the end of resizing
	function endResize() {
		isResizing = false;
	}

	let collapsed = $state(false);
</script>

<svelte:window on:mousemove={ duringResize } on:mouseup={ endResize } />

<div
	bind:this={ target }
	class="
		base:w-1/3 base:overflow-auto
		base:flex base:flex-col
		base:absolute base:left-2/7 base:top-1/3
		{classes}
	"
	style:width={ `${Math.max(width, 100)}px` }
	style:height={ `${Math.max(height, 100)}px` }
>
	{#if drag}
		{@render drag({ collapsed })}
	{:else}
		<div
			role="none"
			class="drag-handle w-full bg-gray-500 px-2"
			ondblclick={() => collapsed = !collapsed}
		>
			drag me! {collapsed ? "(closed)" : ""}
		</div>
	{/if}
	{#if !collapsed}
		<main class="h-full relative" transition:slide>
			{@render children()}
			<div
				role="none"
				class="resize-handle absolute right-px bottom-px cursor-nwse-resize"
				onmousedown={startResize}
			>
				<GripIcon size="12"></GripIcon>
			</div>
		</main>
	{/if}
</div>
