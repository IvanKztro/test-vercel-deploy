import { writable } from "svelte/store";

export const ticketsJson = writable(null);
export const ticketsBuys = writable(null);
export const totalAmount = writable(0);

export const productName = writable("");
export const cartStore = writable({});
export const checkoutStore = writable(null);

export const currentOrderStore = writable(null);
export const currentOrderIDStore = writable("");
