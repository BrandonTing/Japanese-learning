<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';
	import { CursorOptions } from '@/cursorUtil';
	import { userSetting } from '@/states/userSetting.svelte';
	const cursorTypeSelected = $derived({
		value: userSetting.cursorType,
		label: CursorOptions[userSetting.cursorType]
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>User Settings</CardTitle>
		<CardDescription>Customize your experience</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-2">
			<label for="cursor-type" class="text-base font-medium">
				Cursor Type
				<p class="text-sm text-muted-foreground">This setting will activate after you refresh the page</p>
			</label>
			<Select
				selected={cursorTypeSelected}
				onSelectedChange={(selected) => {
					if (selected) {
						userSetting.changeCursorType(selected.value);
					}
				}}
			>
				<SelectTrigger id="cursor-type">
					<SelectValue placeholder="Select cursor type" />
				</SelectTrigger>
				<SelectContent>
					{#each Object.entries(CursorOptions) as [key, label]}
						<SelectItem value={key}>{label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>
	</CardContent>
</Card>
