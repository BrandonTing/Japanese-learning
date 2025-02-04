<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import GenerateLearning from './generateLearning.svelte';
	import Translate from './translate.svelte';
	const AccordionTypes = {
		TRANSLATE: 'Translate',
		GENERATE: 'Generate'
	} as const;
	let accordionValue = $state<(typeof AccordionTypes)[keyof typeof AccordionTypes]>(
		AccordionTypes.TRANSLATE
	);
</script>

<div class="flex flex-col gap-4">
	<Accordion.Root bind:value={accordionValue}>
		<Accordion.Item value={AccordionTypes.TRANSLATE}>
			<Accordion.Trigger>
				<div class="text-left">
					<p>Translate</p>
					<p class="text-sm text-muted-foreground">
						Paste a Japanese article for translation and grammar explanation.
					</p>
				</div>
			</Accordion.Trigger>
			<Accordion.Content>
				<Translate />
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value={AccordionTypes.GENERATE}>
			<Accordion.Trigger>
				<div class="text-left">
					<p>Teach me something New</p>
					<p class="text-sm text-muted-foreground">
						Get a quick lesson on Japanese vocabulary or grammar patterns.
					</p>
				</div>
			</Accordion.Trigger>
			<Accordion.Content>
				<GenerateLearning />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
