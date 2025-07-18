<script lang="ts">
	import type { Component } from "svelte";
	import { dev } from "$app/environment";
	import { page } from "$app/state";
	import { BookUserIcon, EllipsisIcon, FolderCodeIcon, MenuIcon, SettingsIcon, VideoIcon } from "@lucide/svelte";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";
	import "../app.css";

	const { children } = $props();

	let isExpanded = $state(false);

	type Link = {
		label: string;
		href: string;
		icon?: Component;
		labelExpanded: string;
	};
	const links: Link[] = [
		{ label: "Backgrounds", href: "/backgrounds", icon: BookUserIcon, labelExpanded: "Browse Backgrounds" },
	];
	if (dev) {
		links.push({ label: "Demos", href: "/demos", icon: FolderCodeIcon, labelExpanded: "Browse Demos" });
	}
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header class="bg-red-500 p-4 h-14">(header)</header>
	<!-- Grid Column -->
	<div class="
		grid grid-cols-1
		lg:grid-cols-[auto_1fr_auto]
	">
		<!-- Sidebar (Left) -->
		<Navigation.Rail expanded={isExpanded}>
			{#snippet header()}
				<Navigation.Tile title="Menu" onclick={() => { isExpanded = !isExpanded; }}>
					<MenuIcon />
				</Navigation.Tile>
			{/snippet}
			{#snippet tiles()}
				{#each links as { label, href, labelExpanded, icon: Icon }}
					<Navigation.Tile
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
				<Navigation.Tile labelExpanded="Settings" href="#settings" title="settings">
					<SettingsIcon />
				</Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<!-- Main -->
		<main class="p-4 h-[calc(100dvh-3.5rem)] overflow-y-auto">
			{@render children()}
		</main>
		<!-- Sidebar (Right) -->
		<aside class="p-2 hidden">
			(sidebar)
		</aside>
	</div>
</div>
