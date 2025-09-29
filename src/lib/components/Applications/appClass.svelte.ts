import type { DraggableParams } from "animejs";
import type { Component, Snippet } from "svelte";
import { XIcon } from "@lucide/svelte";
import { createDraggable } from "animejs";
import { SvelteMap } from "svelte/reactivity";

interface ApplicationProps {
	id?: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	window: ContentProps;
	classes?: string;
}

export interface ContentProps {
	children?: Snippet<[Application]>;
	drag?: Snippet<[{ collapsed: boolean }]>;
	resizeable?: boolean;
	headerButtons?: Buttons;
}

type Buttons = { title?: string; onclick: (e: MouseEvent) => void; icon?: Component }[];

export class Application {
	id: string;
	position: ApplicationProps["position"] = $state({ x: 250, y: 100 });
	size: ApplicationProps["size"] = $state({ width: 400, height: 300 });

	mounted: boolean = $state(false);
	element: HTMLElement | null = $state(null);
	draggableEl: HTMLElement | null = $state(null);
	classes: string = $state("");

	window: ApplicationProps["window"] = $state({
		headerButtons: [
			{
				title: "",
				onclick: () => this.close(),
				icon: XIcon,
			},
		],
		resizeable: true,
	});

	constructor(props: Partial<ApplicationProps> = {}) {
		if (props.id && window.pf2ools.windowManager.apps.has(String(props.id))) {
			throw new Error(`App with id ${props.id} already exists`);
		}
		this.id = String(props.id || window.pf2ools.windowManager.apps.size + 1);
		this.window.children = props.window?.children;
		this.window.drag = props.window?.drag;
		this.position = props.position || this.position;
		this.size = props.size || this.size;
		this.classes = props.classes || this.classes;
	}

	onMount(el: HTMLElement, dragEl: HTMLElement, options: DraggableParams = {}) {
		const draggable = createDraggable(el, {
			trigger: dragEl,
			container: "#main",
			containerPadding: [12, 12, 36, 12],
			velocityMultiplier: 0.2,
			snap: 1,
			onUpdate: () => {
				// Grab translate values from transform matrix
				const style = window.getComputedStyle(el);
				const matrix = new DOMMatrixReadOnly(style.transform);
				this.position.x = matrix.m41;
				this.position.y = matrix.m42;
			},
			onResize: (self) => {
				const container = (self.$scrollContainer as HTMLElement).getBoundingClientRect();
				this.size.width = Math.min(container.width - self.containerPadding[0] * 2.5, this.size.width);
				this.size.height = Math.min(container.height - self.containerPadding[0] * 2.5, this.size.height);
			},
			...options,
		});

		if (this.size.width === undefined && this.size.height === undefined) {
			this.size.width = el.offsetWidth;
			this.size.height = el.offsetHeight;
		}

		draggable.x = this.position.x;
		draggable.y = this.position.y;

		// Probably not needed but might as well?
		return () => {
			draggable.disable();
			el?.remove();
		};
	}

	setPosition(x: number, y: number) {
		this.position.x = x;
		this.position.y = y;
	}

	setSize(width: number, height: number) {
		this.size.width = width;
		this.size.height = height;
	}

	render() {
		window.pf2ools.windowManager.add(this);
	}

	close() {
		window.pf2ools.windowManager.remove(this.id);
	}
}

export class WindowManager {
	apps: SvelteMap<string, Application>;

	constructor(apps?: WindowManager["apps"]) {
		this.apps = apps ?? new SvelteMap<string, Application>();
	}

	add(app: Application) {
		if (!app.id) throw new Error("App must have an id");
		this.apps.set(app.id, app);
	}

	remove(id: string) {
		this.apps.delete(id);
	}
}

export function createWindowManager() {
	const windows = new WindowManager();
	return windows;
}
