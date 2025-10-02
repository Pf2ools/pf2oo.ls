<script lang="ts">
	import type { WindowManager } from "./appClass.svelte";
	import Application from "./Application.svelte";

	const { windowManager }: { windowManager: WindowManager	} = $props();

	// Esc = Close Window
	// Shift + Esc = Close All Windows
	function escapeKeyClose(event: KeyboardEvent) {
		if (windowManager.apps.size === 0) return;
		if (event.key === "Escape") {
			if (event.shiftKey) {
				windowManager.closeAll();
			}
			else if (event.key === "Escape") {
				windowManager.closeLast();
			}
			event.preventDefault();
		}
	}
</script>

<svelte:window on:keydown={ escapeKeyClose } />

{#each windowManager.apps as [id, app] (id)}
	<Application {app} />
{/each}
