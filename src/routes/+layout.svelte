<script lang="ts">
	import { page } from "$app/state";
	import IconFolder from "@lucide/svelte/icons/folder";
	import IconImage from "@lucide/svelte/icons/image";
	import IconMenu from "@lucide/svelte/icons/menu";
	import IconMusic from "@lucide/svelte/icons/music";
	import IconSettings from "@lucide/svelte/icons/settings";
	import IconVideo from "@lucide/svelte/icons/video";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";
	import "../app.css";

	const { children } = $props();

	let isExpanded = $state(false);

	const links = [
		{ label: "Files", href: "#/files", icon: IconFolder, labelExpanded: "Browse Files" },
		{ label: "Images", href: "#/images", icon: IconImage, labelExpanded: "Browse Images" },
		{ label: "Music", href: "#/music", icon: IconMusic, labelExpanded: "Browse Music" },
		{ label: "Videos", href: "#/videos", icon: IconVideo, labelExpanded: "Browse Videos" },
	];
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
				<Navigation.Tile title="Menu" onclick={() => {isExpanded = !isExpanded}}><IconMenu /></Navigation.Tile>
			{/snippet}
			{#snippet tiles()}
				{#each links as { label, href, labelExpanded, icon: Icon }}
					<Navigation.Tile
						{label}
						{href}
						{labelExpanded}
						selected={page.url.pathname === href}
					>
						<Icon></Icon>
					</Navigation.Tile>
				{/each}
			{/snippet}
			{#snippet footer()}
				<Navigation.Tile labelExpanded="Settings" href="#settings" title="settings"><IconSettings /></Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<!-- Main -->
		<main class="p-4 bg-green-600">
			{@render children()}
		</main>
		<!-- Sidebar (Right) -->
		<aside class="bg-yellow-500 p-2 hidden">
			(sidebar)
		</aside>
	</div>
</div>
