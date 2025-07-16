<script lang="ts">
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';
</script>

<article class="text-center p-8 space-y-4">
	<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
	<div>
		<button
			class="border px-1 rounded"
			class:bg-amber-400={getLocale() === "en"}
			onclick={() => setLocale('en')}
		>
			🇬🇧 en
		</button>
		<button
			class="border px-1 rounded"
			class:bg-amber-400={getLocale() === "es"}
			onclick={() => setLocale('es')}
		>
			🇪🇸 es
		</button>
		<button
			class="border px-1 rounded"
			class:bg-amber-400={getLocale() === "pl"}
			onclick={() => setLocale('pl')}
		>
			🇵🇱 pl
		</button>
	</div><p>
	If you use VSCode, install the <a href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension" target="_blank">Sherlock i18n extension</a> for a better i18n experience.
	</p>
</article>