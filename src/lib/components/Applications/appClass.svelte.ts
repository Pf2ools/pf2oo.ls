import type { Draggable, DraggableParams } from "animejs";
import type { Component } from "svelte";
import { XIcon } from "@lucide/svelte";
import { createDraggable } from "animejs";
import { createSubscriber, SvelteMap } from "svelte/reactivity";

export interface ApplicationProps<T extends Record<string, any>> {
	id?: string;
	position: { x: number; y: number };
	size: { width: number | string; height: number | string };
	window: {
		title: string;
		children?: Component<T>;
		resizeable?: boolean;
		headerButtons?: { title?: string; onclick: (e: MouseEvent) => void; icon?: Component }[];
	};
	classes?: string;
	props?: T;
}

export class Application<T extends Record<string, any>> {
	id: string;

	mounted: boolean = $state(false);
	element: HTMLElement | null = $state(null);
	draggableEl: HTMLElement | null = $state(null);
	classes: string = $state("");
	draggable: Draggable | null = $state(null);

	props: T = $state({} as T);

	size: ApplicationProps<T>["size"] = $state({ width: 400, height: 300 });
	window: ApplicationProps<T>["window"] = $state({
		title: "App Window",
		headerButtons: [
			{
				title: "",
				onclick: () => this.close(),
				icon: XIcon,
			},
		],
		resizeable: true,
	});

	constructor(props: Partial<ApplicationProps<T>> = {}) {
		if (props.id && window.pf2ools.windowManager.apps.has(String(props.id))) {
			throw new Error(`App with id ${props.id} already exists`);
		}
		this.id = String(props.id || window.pf2ools.windowManager.apps.size + 1);
		this.window.children = props.window?.children;
		this.window.title = props.window?.title ?? `App Window ${this.id}`;
		this.props = props.props ?? {} as T;
		if (props.position) {
			this.#x = props.position.x;
			this.#y = props.position.y;
		}
		this.size = props.size || this.size;
		this.classes = props.classes || this.classes;

		this.#subscribe = createSubscriber((update) => {
			this.#updateSubscribers = update;
		});
	}

	#subscribe;
	#updateSubscribers: (() => void) | undefined;

	#x: number = 250;
	#y: number = 100;

	get x() {
		this.#subscribe();
		return this.#x;
	}

	get y() {
		this.#subscribe();
		return this.#y;
	}

	set x(arg) {
		if (this.draggable) {
			const [_top, _right, _bottom, _left] = this.draggable.containerBounds;
			this.draggable.x = Math.min(Math.max(arg, _left), _right);
		};
		this.#updateSubscribers?.();
	}

	set y(arg) {
		if (this.draggable) {
			const [_top, _right, _bottom, _left] = this.draggable.containerBounds;
			this.draggable.y = Math.min(Math.max(arg, _top), _bottom);
		};
		this.#updateSubscribers?.();
	}

	onMount(el: HTMLElement, dragEl: HTMLElement, options: DraggableParams = {}) {
		this.draggable = createDraggable(el, {
			trigger: dragEl,
			container: "#main",
			containerPadding: [12, 12, 12, 12],
			velocityMultiplier: 0.2,
			snap: 1,
			cursor: { onHover: "move" },
			onUpdate: () => {
				// Grab translate values from transform matrix
				const style = window.getComputedStyle(el);
				const matrix = new DOMMatrixReadOnly(style.transform);
				this.#x = matrix.m41;
				this.#y = matrix.m42;
				this.#updateSubscribers?.();
			},
			onResize: (self) => {
				const container = (self.$container as HTMLElement).getBoundingClientRect();
				this.size.width = Math.min(
					container.width - self.containerPadding[0] * 2.5,
					Number(this.size.width) ? Number(this.size.width) : Infinity,
				);
				this.size.height = Math.min(
					container.height - self.containerPadding[0] * 2.5,
					Number(this.size.height) ? Number(this.size.height) : Infinity,
				);
			},
			...options,
		});

		// Set position.
		// Must be cloned as assignment will trigger onUpdate above, changing the other property.
		const [x, y] = [this.#x, this.#y];
		this.x = x;
		this.y = y;

		// Set size of element to class
		if (this.size.width === undefined && this.size.height === undefined) {
			this.size.width = el.offsetWidth;
			this.size.height = el.offsetHeight;
		}

		// Min size to draggable's boundaries
		if (el.getBoundingClientRect().width > this.draggable.$container.getBoundingClientRect().width) {
			this.size.width = this.draggable.$container.getBoundingClientRect().width - this.draggable.containerPadding[0] * 2.5;
		}
		if (el.getBoundingClientRect().height > this.draggable.$container.getBoundingClientRect().height) {
			this.size.height = this.draggable.$container.getBoundingClientRect().height - this.draggable.containerPadding[0] * 2.5;
		}

		// Mark as mounted
		this.mounted = true;
		this.element = el;
		this.draggableEl = dragEl;

		// Probably not needed but might as well?
		return () => {
			if (this.draggable) {
				this.draggable.disable();
				this.draggable = null;
			};
			el?.remove();

			this.mounted = false;
			this.element = null;
			this.draggableEl = null;
		};
	}

	render() {
		window.pf2ools.windowManager.add(this);
	}

	close() {
		window.pf2ools.windowManager.remove(this.id);
	}
}

export class WindowManager {
	apps: SvelteMap<string, Application<any>>;

	constructor(apps?: WindowManager["apps"]) {
		this.apps = apps ?? new SvelteMap<string, Application<any>>();
	}

	add(app: Application<any>) {
		if (!app.id) throw new Error("App must have an id");
		this.apps.set(app.id, app);
	}

	remove(id: string) {
		this.apps.delete(id);
	}

	closeAll() {
		this.apps.clear();
	}

	closeLast() {
		const lastKey = Array.from(this.apps.keys()).pop();
		if (lastKey) {
			this.apps.delete(lastKey);
		}
	}
}
