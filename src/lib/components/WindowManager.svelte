<script lang="ts" module>
	import type { Snippet } from "svelte";
	import type { WindowProps } from "./Window.svelte";
	import { SvelteSet } from "svelte/reactivity";

	type WindowType = {
		window: WindowProps;
	};

	export function createWindowManager() {
		const windows = new SvelteSet<WindowType>();
		return windows;
	}
</script>

<script lang="ts">
	import Window from "./Window.svelte";

	type Props = {
		windows: Set<WindowType>;
	};
	const { windows }: Props = $props();
</script>

{#each windows as app}
	<Window {...app.window}>
	</Window>
{/each}
