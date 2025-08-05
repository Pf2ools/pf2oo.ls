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
>
	<div class="drag-handle w-full bg-gray-500">
		drag me!
	</div>
	{@render children()}
</div>
