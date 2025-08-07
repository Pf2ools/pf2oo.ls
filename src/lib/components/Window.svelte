<script lang="ts">
	import type { DraggableParams } from "animejs";
	import type { Snippet } from "svelte";
	import { createDraggable, Draggable } from "animejs";
	import { onMount } from "svelte";

	type Props = {
		children: Snippet<[]>;
		drag?: Snippet<[]>;
		draggableOptions?: DraggableParams;
		classes?: string;
	};
	const { children, drag, draggableOptions, classes }: Props = $props();

	let target: HTMLElement | undefined;
	// eslint-disable-next-line unused-imports/no-unused-vars
	let draggable: Draggable | undefined;

	onMount(() => {
		if (!target) throw new Error("Somehow, there is no target to make draggable.");
		draggable = createDraggable(target, {
			trigger: ".drag-handle",
			container: "body",
			containerFriction: 1,
			velocityMultiplier: 0.2,
			...draggableOptions,
		});
	});
</script>

<div
	bind:this={ target }
	class="base:resize base:overflow-auto base:w-1/3 base:flex base:flex-col base:absolute base:left-48 {classes}"
>
	{#if drag}
		{@render drag()}
	{:else}
		<div class="drag-handle w-full bg-gray-500 px-2">
			drag me!
		</div>
	{/if}
	{@render children()}
</div>
