<script lang="ts">
	import type { WindowManager } from "./appClass.svelte";
	import Application from "./application.svelte";

	type Props = {
		windowManager: WindowManager;
	};
	const { windowManager }: Props = $props();
</script>

{#each windowManager.apps as [id, app] (id)}
	<Application {app} />
{/each}
