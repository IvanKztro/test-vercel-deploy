import { get, writable } from "svelte/store";
import { ticketsJson } from "./cart-store";

export const steps = writable([
  {
    title: "Reserva",
    ishere: true,
    position: 1,
  },
  {
    title: "Tickets",
    ishere: get(ticketsJson) ? true : false,
    position: 2,
  },
  {
    title: "Confirmar y Pagar",
    ishere: false,
    position: 3,
  },
]);
export const position = writable(get(ticketsJson) ? 2 : 1);

export const tabs = writable(["General", "Notificaciones", "Facturación"]);
export const tabselected = writable("General");

export const currentPageStore = writable("");
export const isloadingTickets = writable(false);
export const notificationsStore = writable([]);
