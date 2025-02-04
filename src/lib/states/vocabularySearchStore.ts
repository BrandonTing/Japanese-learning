import { writable } from 'svelte/store';

export const vocabularyMap = writable<Record<string, string>>({});
