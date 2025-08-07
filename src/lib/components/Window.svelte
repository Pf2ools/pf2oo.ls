<script lang="ts">
	import type { Snippet } from "svelte";

	import {
		bounds,
		BoundsFrom,
		ControlFrom,
		controls,
		draggable,
	} from "@neodrag/svelte";

	type Props = {
		children: Snippet<[]>;
	};
	const { children }: Props = $props();
</script>

<div
	{@attach draggable([
		controls({ allow: ControlFrom.selector(".drag-handle") }),
		bounds(BoundsFrom.viewport()),
	])}
	class="resize overflow-auto absolute w-1/3 flex flex-col"
>
	<div class="drag-handle w-full bg-gray-500">
		drag me!
	</div>
	{@render children()}
</div>
