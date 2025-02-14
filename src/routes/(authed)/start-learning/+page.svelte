<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import GenerateLearning from './generateLearning.svelte';
	import Translate from './translate/translateHub.svelte';
	import Vocabulary from './vocabulary.svelte';
	const AccordionTypes = {
		VOCABULARY: 'Vocabulary',
		TRANSLATE: 'Translate',
		GENERATE: 'Generate'
	} as const;
	let accordionValue = $state<(typeof AccordionTypes)[keyof typeof AccordionTypes]>(
		AccordionTypes.VOCABULARY
	);
</script>

<div class="flex flex-col gap-4">
	<Accordion.Root bind:value={accordionValue}>
		<Accordion.Item value={AccordionTypes.VOCABULARY}>
			<Accordion.Trigger>Vocabulary Explanation</Accordion.Trigger>
			<Accordion.Content>
				<Vocabulary />
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value={AccordionTypes.TRANSLATE}>
			<Accordion.Trigger>Translate</Accordion.Trigger>
			<Accordion.Content>
				<Translate />
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value={AccordionTypes.GENERATE}>
			<Accordion.Trigger>Teach me something New</Accordion.Trigger>
			<Accordion.Content>
				<GenerateLearning />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
