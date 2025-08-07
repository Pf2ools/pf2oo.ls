<script lang="ts">
	import type { Draggable, DraggableParams } from "animejs";
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
	// eslint-disable-next-line unused-imports/no-unused-vars
	let draggable: Draggable;

	let width = $state() as number;
	let height = $state() as number;

	onMount(() => {
		if (!target) throw new Error("Somehow, there is no target to make draggable.");
		draggable = createDraggable(target, {
			trigger: ".drag-handle",
			container: "#main",
			containerPadding: [4, 4, 4, 4],
			velocityMultiplier: 0.2,
			onResize: (self) => {
				const container = (self.$scrollContainer as HTMLElement).getBoundingClientRect();
				width = Math.min(container.width - self.containerPadding[0] * 2.5, width);
				height = Math.min(container.height - self.containerPadding[0] * 2.5, height);
			},
			...draggableOptions,
		});
	});

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
	let headerHeight = $state(8);
</script>

<svelte:window on:mousemove={ duringResize } on:mouseup={ endResize } />

<div
	bind:this={ target }
	class="
		base:w-1/3 base:overflow-auto
		base:flex base:flex-col
		{classes}
	"
	style:width={ `${Math.max(width, 100)}px` }
	style:height={ collapsed ? headerHeight : `${Math.max(height, 100)}px` }
>
	<header bind:clientHeight={ headerHeight }>
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
	</header>
	{#if !collapsed}
		<main class="h-full relative overflow-auto" transition:slide>
			{@render children()}
		</main>
		<div
			role="none"
			class="resize-handle absolute right-px bottom-px cursor-nwse-resize"
			onmousedown={startResize}
		>
			<GripIcon size="12"></GripIcon>
		</div>
	{/if}
</div>
