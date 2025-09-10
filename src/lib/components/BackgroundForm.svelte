<script lang="ts">
	import { dev } from "$app/environment";
	import { Plus } from "@lucide/svelte";
	import { slide } from "svelte/transition";

	/*
	import { background } from "pf2ools-schema";
	import { superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";

	const { data = {} } = $props();

	const { enhance } = superForm(data, {
		SPA: true,
		// @ts-expect-error Zod problem
		validators: zod4(background),
	});
*/

	let nameExpanded: boolean = $state(dev);
</script>

<form
	class="pf2e-card p-3 max-h-full flex flex-col size-full space-y-2"
>
	<label class="label">
		<span class="label-text flex items-center">
			Primary Name
			<div class="ml-auto flex items-center gap-1">
				{nameExpanded ? "Less Options" : "More Options"}
				<button
					class="border border-surface-400-600 rounded-sm"
					type="button"
					onclick={() => (nameExpanded = !nameExpanded)}
				>
					<Plus size={16} />
				</button>
			</div>
		</span>
		<input type="text" class="input" placeholder="Name" />
	</label>
	{#if nameExpanded}
		<div transition:slide class="space-y-2 p-3 py-2 pf2e-card rounded-sm">
			<label class="label">
				<span class="label-text">Specifier</span>
				<input type="text" class="input" placeholder="Specifier" />
			</label>
			<label class="label">
				<span class="label-text">Aliases</span>
				<input type="text" class="input" placeholder="Aliases (comma ',' separated)" />
			</label>
		</div>
	{/if}
</form>
