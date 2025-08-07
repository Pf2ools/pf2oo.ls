<script lang="ts">
	import type { DraggableParams } from "animejs";
	import type { Snippet } from "svelte";
	import { createDraggable, Draggable } from "animejs";
	import { onMount } from "svelte";

	type Props = {
		children: Snippet<[]>;
		draggableOptions: DraggableParams;
	};
	const { children, draggableOptions }: Props = $props();

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
	class="resize overflow-auto w-1/3 flex flex-col absolute left-48"
>
	<div class="drag-handle w-full bg-gray-500">
		drag me!
	</div>
	{@render children()}
</div>
