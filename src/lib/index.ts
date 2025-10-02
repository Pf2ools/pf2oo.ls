// place files you want to import through the `$lib` alias in this folder.

import { WindowManager } from "./components/Applications/appClass.svelte";

// eslint-disable-next-line import/no-mutable-exports
let windowManager = new WindowManager();

export { windowManager };

if (import.meta.hot) {
	import.meta.hot.accept(
		[
			"./components/Applications/appClass.svelte",
		],
		([appMod]) => {
			if (appMod) {
				windowManager = new appMod.WindowManager(windowManager.apps);
				console.warn(`Hot reloaded the window manager with ${windowManager.apps.size} apps.`);
			}
		},
	);
}
