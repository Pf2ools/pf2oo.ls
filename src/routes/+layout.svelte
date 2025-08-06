<script lang="ts">
	import type { Component } from "svelte";
	import { dev, version } from "$app/environment";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { m } from "$lib/paraglide/messages";
	import { getLocale, locales, setLocale } from "$lib/paraglide/runtime";
	import { BookUserIcon, EllipsisIcon, FolderCodeIcon, HouseIcon, MenuIcon, SettingsIcon } from "@lucide/svelte";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";
	import { PersistedState } from "runed";
	import "../app.css";

	const { children } = $props();

	const isExpanded = new PersistedState("isExpanded", false);

	type Link = {
		label: string;
		href: string;
		icon?: Component;
		labelExpanded: string;
	};
	const links: Link[] = [
		{
			href: resolve("/backgrounds"),
			icon: BookUserIcon,
			label: m["pages.background"](),
			labelExpanded: m["pageLabels.background"](),
		},
	/*
		{
			href: resolve("/events"),
			icon: BellIcon,
			label: m["pages.event"](),
			labelExpanded: m["pageLabels.event"](),
		},
		{
			href: resolve("/sources"),
			icon: LibraryBigIcon,
			label: m["pages.source"](),
			labelExpanded: m["pageLabels.source"](),
		},
	*/
	];
	if (dev) {
		links.push({ label: "Demos", href: "/demos", icon: FolderCodeIcon, labelExpanded: "Browse demos" });
	}
</script>

<div class="grid h-dvh w-dvw background-pattern-cube grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<!-- <header class="bg-red-500 p-4 h-14">(header)</header> -->
	<!-- Grid Column -->
	<div class="
		grid grid-cols-[auto_1fr_auto]
	">
		<!-- Sidebar (Left) -->
		<Navigation.Rail
			expanded={isExpanded.current}
			classes="transition-[width]"
			padding=""
			tilesGap=""
			height="max-h-[calc(100vh-3.5rem)]"
			tilesClasses="overflow-y-auto scrollbar-none"
			tilesJustify=""
		>
			{#snippet header()}
				<Navigation.Tile
					title="Menu"
					labelExpanded="Shrink Menu"
					onclick={() => { isExpanded.current = !isExpanded.current; }}
					classes="flex-col justify-center h-12"
				>
					<MenuIcon />
				</Navigation.Tile>
				<Navigation.Tile
					classes="flex-col justify-center h-16"
					active="preset-tonal-primary"
					rounded=""
					label="Home"
					href={resolve("/")}
					labelExpanded="Home"
					selected={page.url.pathname === "/"}
				>
					<HouseIcon></HouseIcon>
				</Navigation.Tile>
			{/snippet}
			{#snippet tiles()}
				{#each links as { label, href, labelExpanded, icon: Icon }}
					<Navigation.Tile
						classes="flex-col justify-center h-16"
						active="preset-tonal-primary"
						rounded=""
						{label}
						{href}
						{labelExpanded}
						selected={page.url.pathname.includes(href)}
					>
						{#if Icon}
							<Icon></Icon>
						{:else}
							<EllipsisIcon />
						{/if}
					</Navigation.Tile>
				{/each}
			{/snippet}
			{#snippet footer()}
				<select
					class="select w-20"
					value={getLocale()}
					onchange={(ev) => setLocale(ev.currentTarget.value as typeof locales[number])}
				>
					<option value="en">EN</option>
					<option value="es">ES</option>
					<option value="pl">PL</option>
				</select>
				<Navigation.Tile labelExpanded="Settings" title="settings" rounded="">
					<SettingsIcon />
				</Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<!-- Main -->
		<main class="p-2 sm:p-4 h-[calc(100dvh-0rem)] overflow-y-auto">
			{@render children()}
			<div id="version-tag" class="absolute bottom-px right-0.5 text-[0.55rem] text-gray-500/50 font-mono select-all">
				V.{version}
			</div>
		</main>
		<!-- Sidebar (Right) -->
		<aside class="p-2 hidden">
			(sidebar)
		</aside>
	</div>
</div>
