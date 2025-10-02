<script lang="ts">
	import type { WindowManager } from "./appClass.svelte";
	import Application from "./Application.svelte";

	const { windowManager }: { windowManager: WindowManager	} = $props();

	// Esc = Close Window
	// Shift + Esc = Close All Windows
	function escapeKeyClose(event: KeyboardEvent) {
		if (event.key === "Escape" && event.shiftKey) {
			windowManager.closeAll();
		}
		else if (event.key === "Escape") {
			windowManager.closeLast();
		}
	}
</script>

<svelte:window on:keydown={ escapeKeyClose } />

{#each windowManager.apps as [id, app] (id)}
	<Application {app} />
{/each}
