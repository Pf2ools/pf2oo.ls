<script lang="ts">
	import type { Draggable, DraggableParams } from "animejs";
	import type { Component, Snippet } from "svelte";
	import { GripIcon } from "@lucide/svelte";
	import { createDraggable } from "animejs";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";

	export type ContentProps = {
		isResizing: boolean;
		width: number;
		height: number;
		draggable: Draggable;
		collapsed: boolean;
		collapse: () => Promise<void>;
		expand: () => void;
		toggle: () => void;
	};

	export type WindowProps = {
		children: Snippet<[ContentProps]>;
		drag?: Snippet<[{ collapsed: boolean }]>;
		draggableOptions?: DraggableParams;
		classes?: string;
		resizeable?: boolean;
		headerButtons?: { title?: string; onclick: (e: MouseEvent) => void; icon?: Component }[];
	};
	const { children, drag, draggableOptions, classes, resizeable = true, headerButtons }: WindowProps = $props();

	// TODO: Evaluate if the custom resize code is actually needed if I have the onResize callback
	// One benefit is it works without having to actually have your mouse on the resizer (re: Foundry V13)

	let target: HTMLElement | undefined;
	let dragHandle: HTMLElement | undefined;

	// svelte-ignore non_reactive_update
	let draggable: Draggable;

	let width = $state() as number;
	let height = $state() as number;

	onMount(() => {
		if (!target) throw new Error("Somehow, there is no target to make draggable.");
		draggable = createDraggable(target, {
			trigger: dragHandle,
			container: "#main",
			containerPadding: [12, 12, 12, 12],
			velocityMultiplier: 0.2,
			onResize: (self) => {
				if (!resizeable) return;
				const container = (self.$scrollContainer as HTMLElement).getBoundingClientRect();
				width = Math.min(container.width - self.containerPadding[0] * 2.5, width);
				height = Math.min(container.height - self.containerPadding[0] * 2.5, height);
			},
			...draggableOptions,
		});

		if (width === undefined && height === undefined) {
			width = target.offsetWidth;
			height = target.offsetHeight;
		}

		// Probably not needed but might as well?
		return () => {
			draggable.disable();
			target?.remove();
		};
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
		if (!resizeable) return;
		const container = (draggable.$scrollContainer as HTMLElement).getBoundingClientRect();
		if (isResizing) {
			width = Math.max(
				100,
				Math.min(
					initialElemWidth + (e.clientX - initialMouseX),
					container.width - draggable.containerPadding[0],
				),
			);
			height = Math.max(
				100,
				Math.min(
					initialElemHeight + (e.clientY - initialMouseY),
					container.height - draggable.containerPadding[0],
				),
			);
		}
	}

	// Function to handle the end of resizing
	function endResize() {
		isResizing = false;
	}

	let collapsed = $state(false);
	let preCollapseHeight = $state(48);
	let preCollapseWidth = $state(48);

	async function collapse() {
		collapsed = true;
		preCollapseHeight = height;
		preCollapseWidth = width;
	}

	function expand() {
		collapsed = false;
		height = preCollapseHeight;
		width = preCollapseWidth;
	}

	function toggle() {
		collapsed ? expand() : collapse();
	}
</script>

<svelte:window on:mousemove={ duringResize } on:mouseup={ endResize } />

<div
	bind:this={ target }
	class="
		base:w-1/3 base:overflow-auto
		base:flex base:flex-col absolute
		base:z-10
		{classes}
	"
	style:width={ collapsed ? "16rem" : `${width}px` }
	style:height={ collapsed ? "min-content" : `${height}px` }
>
	<header class="select-none" bind:this={ dragHandle }>
		{#if drag}
			{@render drag({ collapsed })}
		{:else}
			<section
				role="none"
				class="w-full bg-gray-500 px-2 flex gap-2"
				ondblclick={toggle}
			>
				<header>
					drag me! {collapsed ? "(closed)" : ""}
				</header>
				<div class="ml-auto [&>*]:hover:underline flex gap-2">
					{#each headerButtons || [] as { title, onclick, icon: Icon }}
						<button
							class="flex gap-0.5 items-center"
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
		{/if}
	</header>
	{#if !collapsed}
		<div class="h-full relative overflow-hidden" transition:slide>
			<main class="h-full relative overflow-auto">
				{@render children({ isResizing, width, height, draggable, collapsed, collapse, expand, toggle })}
			</main>
			{#if resizeable}
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
