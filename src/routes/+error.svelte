<script lang="ts">
	import { page } from "$app/state";
</script>

<main class="container mx-auto p-16 flex flex-row gap-4">
	<div class="pf2e-card p-2 rounded space-y-2 text-justify w-full">
		<h1 class="font-sans h4 text-center">Error {page.status}!</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		<p class="text-center">
			{page.error?.message}
		</p>
	</div>
	<div class="pf2e-card p-2 rounded space-y-2 text-justify w-full">
		<h1 class="font-sans h4 text-center">Why am I seeing this?</h1>
		<hr class="hr border-primary-300-700 shadow-primary-contrast-300-700">
		{#if page.status === 404}
			<p>
				It looks like you are trying to access a part of the website that does not (seemingly) exist.
			</p>
			<p>
				Make sure your link is correct and does not have any typos in it.
			</p>
			<p>
				If you are attempting to access something that does not come with the site (such as user-made content, i.e. <i>"homebrew"</i>), you may need to navigate again <a class="anchor" href={page.url.pathname}>here</a>, now that the website has been loaded into your browser and is able to handle requests.
			</p>
		{:else}
			<p>
				Uh, we have not accounted for this... Please report this to our <a href="https://github.com/Pf2eToolsOrg/pf2oo.ls">GitHub</a> or check in at our Discord! (TODO: link pending)
			</p>
		{/if}
	</div>
</main>
