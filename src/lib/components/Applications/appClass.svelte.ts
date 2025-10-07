import type { Draggable, DraggableParams } from "animejs";
import type { Component } from "svelte";
import { XIcon } from "@lucide/svelte";
import { createDraggable } from "animejs";
import { SvelteMap } from "svelte/reactivity";

/**
 * Props for an Application instance.
 * @template T - Type of the additional props passed to the child component.
 */
export interface ApplicationProps<T extends Record<string, any> = Record<string, any>> {
	id?: string;
	position?: { x: number; y: number };
	size?: { width: number | string; height: number | string };
	window: {
		title?: string;
		children?: Component<T>;
		resizeable?: boolean;
		headerButtons?: {
			title?: string;
			class?: string;
			onclick: (e: MouseEvent) => void;
			icon?: Component;
		}[];
	};
	classes?: string;
	props?: T;
}

/**
 * Manages an application window with draggable and resizable capabilities.
 * @template T - Type of the additional props passed to the child component.
 */
export class Application<T extends Record<string, any> = Record<string, any>> {
	readonly id: string;

	mounted: boolean = $state(false);
	element: HTMLElement | null = $state(null);
	draggableEl: HTMLElement | null = $state(null);
	classes: string = $state("");
	draggable: Draggable | null = $state(null);
	collapsed = $state(false);

	props: T = $state({} as T);

	size: NonNullable<ApplicationProps<T>["size"]> = $state({ width: 400, height: 300 });
	window: ApplicationProps<T>["window"] = $state({
		title: "App Window",
		headerButtons: [
			{
				title: "",
				class: "",
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

		if (props.window) {
			this.window = { ...this.window, ...props.window };
		}
		this.window.title ??= `App Window ${this.id}`;

		// TODO: Figure out why this is wrong
		this.props = { app: this, ...(props.props || {}) } as unknown as T;

		this.#position = props.position ?? this.#position;
		this.size = props.size ?? this.size;
		this.classes = props.classes ?? this.classes;
	}

	#position = {
		x: $state(250),
		y: $state(100),
	};

	get x() {
		return this.#position.x;
	}

	get y() {
		return this.#position.y;
	}

	set x(arg) {
		if (this.draggable) {
			const [_top, _right, _bottom, _left] = this.draggable.containerBounds;
			this.draggable.x = Math.min(Math.max(arg, _left), _right);
		};
	}

	set y(arg) {
		if (this.draggable) {
			const [_top, _right, _bottom, _left] = this.draggable.containerBounds;
			this.draggable.y = Math.min(Math.max(arg, _top), _bottom);
		};
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
				this.#position.x = matrix.m41;
				this.#position.y = matrix.m42;
			},
			onResize: (self) => {
				if (this.collapsed) return;
				const container = (self.$container as HTMLElement).getBoundingClientRect();
				const element = (self.$target as HTMLElement).getBoundingClientRect();
				const padding = self.containerPadding[0] * 2.5;

				this.size.width = Math.min(container.width - padding, element.width);
				this.size.height = Math.min(container.height - padding, element.height);
			},
			...options,
		});

		// Set position.
		// Must be cloned as assignment will trigger onUpdate above, changing the other property.
		const [x, y] = [this.#position.x, this.#position.y];
		this.x = x;
		this.y = y;

		// Set size of element to class
		this.size.width ??= el.offsetWidth;
		this.size.height ??= el.offsetHeight;

		// Ensure window does not exceed container dimensions on mount
		const containerWidth = this.draggable.$container.getBoundingClientRect().width;
		const containerHeight = this.draggable.$container.getBoundingClientRect().height;
		const currentElWidth = el.getBoundingClientRect().width;
		const currentElHeight = el.getBoundingClientRect().height;
		const padding = this.draggable.containerPadding[0] * 2.5;

		if (currentElWidth > containerWidth - padding) {
			this.size.width = containerWidth - padding;
		}
		if (currentElHeight > containerHeight - padding) {
			this.size.height = containerHeight - padding;
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

	_restart() {
		this.close();
		const app = new Application(this);
		app.render();
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

	_restartAll() {
		this.apps.forEach((x) => x._restart());
	}
}
