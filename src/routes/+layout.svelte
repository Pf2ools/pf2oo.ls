<script lang="ts">
	import type { Component } from "svelte";
	import { dev, version } from "$app/environment";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { windowManager } from "$lib";
	import WindowManager from "$lib/components/WindowManager.svelte";
	import { m } from "$lib/paraglide/messages";
	import { getLocale, locales, setLocale } from "$lib/paraglide/runtime";
	import { BookUserIcon, CodeXmlIcon, EllipsisIcon, FolderCodeIcon, HouseIcon, MenuIcon, SettingsIcon } from "@lucide/svelte";
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
	if (dev || page.url.origin.includes("github")) {
		links.push({ label: "Demos", href: resolve("/demos"), icon: FolderCodeIcon, labelExpanded: "Browse demos" });
	}
</script>

<WindowManager {windowManager} />

<div class="overflow-hidden grid background-pattern-cube grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<!-- <header class="bg-red-500 p-4 h-14">(header)</header> -->
	<!-- Grid Column -->
	<div class="grid grid-cols-[auto_1fr_auto] h-dvh w-dvw">
		<!-- Sidebar (Left) -->
		<Navigation.Rail
			expanded={isExpanded.current}
			classes="transition-[width]"
			padding=""
			tilesGap=""
			headerGap=""
			height="min-h-dvh"
			tilesClasses="overflow-y-auto scrollbar-none"
			tilesJustify=""
		>
			{#snippet header()}
				<Navigation.Tile
					classes="flex-col justify-center h-12"
					rounded=""
					title="Menu"
					labelExpanded="Shrink Menu"
					onclick={() => { isExpanded.current = !isExpanded.current; }}
				>
					<MenuIcon />
				</Navigation.Tile>
				<Navigation.Tile
					classes="flex-col justify-center h-16"
					active="preset-tonal-primary"
					rounded=""
					label="Home"
					labelExpanded="Home"
					href={resolve("/")}
					selected={page.url.pathname === resolve("/")}
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
		<main id="main" class="p-2 sm:p-4 overflow-hidden overflow-y-auto">
			{@render children()}
			<div id="version-tag" class="absolute bottom-1 right-1 text-[0.55rem] text-gray-500/50 font-mono select-all">
				V.{version} <a class="anchor" target="_blank" href="https://github.com/Pf2eToolsOrg/pf2oo.ls"><CodeXmlIcon size={12} class="inline-block pb-px"></CodeXmlIcon></a>
			</div>
		</main>
		<!-- Sidebar (Right) -->
		<aside class="p-2 hidden">
			(sidebar)
		</aside>
	</div>
</div>
