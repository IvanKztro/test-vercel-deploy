import { writable } from "svelte/store";

export const currentEvent = writable(null);
export const currentEventID = writable(null);
export const productsStore: any = writable(null);
export const productsFilterStore: any = writable(null);
export const formsStore: any = writable(null);
export const searchStore: any = writable("");
