<script lang="ts" module>
	import type { WindowProps } from "./Window.svelte";
	import { XIcon } from "@lucide/svelte";
	import { SvelteMap } from "svelte/reactivity";

	type AppType = {
		id?: string;
		window: WindowProps;
	};

	export function createWindowManager() {
		const windows = new WindowManager();
		return windows;
	}

	class WindowManager {
		windows = new SvelteMap<string, AppType>();

		// Ensure type-safe ID generation
		generateId(app: AppType): string {
			const id = String(this.windows.size + 1);
			app.id = id;
			return id;
		}

		add(app: AppType) {
			const id = this.generateId(app);
			// Ensure there is a close button
			app.window.headerButtons ??= [];
			app.window.headerButtons.push({
				title: "",
				onclick: () => this.remove(id),
				icon: XIcon,
			});
			this.windows.set(id, app);
		}

		remove(id: string) {
			this.windows.delete(id);
		}
	}
</script>

<script lang="ts">
	import Window from "./Window.svelte";

	type Props = {
		windowManager: WindowManager;
	};
	const { windowManager }: Props = $props();
</script>

{#each windowManager.windows as [id, app] (id)}
	<Window {...app.window}>
	</Window>
{/each}
