<script lang="ts">
  import { cartStore, productName, ticketsJson } from "$lib/stores/cart-store";
  import DropdownForm from "./dropdown-form.svelte";
  import { setCookie } from "$lib/utils";
  import { get } from "svelte/store";
  import { userData } from "$lib/stores/user-store";

  export let ticket: any;
  export let infoTickets: any;
  let ticketscount = 0;
  let ticketapproved = 0;

  let infoT: any = [];
  $: {
    if ($userData) {
      ticketapproved = 0;
      ticketscount = 0;
      infoT = Object.values(infoTickets);
      ticketscount = infoT?.length;
      infoT.forEach((item: any) => {
        if (item?.done) ticketapproved++;
      });

      if (ticketscount === ticketapproved) {
        ticket.done = true;
        setCookie(
          `cart-order-${$productName}-${$userData.firebaseID}`,
          get(ticketsJson)
        );
      } else ticket.done = false;
    }
  }

  function incrementTicketcount() {
    ticketapproved += 1;
  }
</script>

{#if infoT?.length > 0 && $cartStore}
  <h2 class="font-semibold text-xl my-7">
    {ticket.title}
  </h2>

  <div class="flex flex-col gap-3">
    {#each infoT as t, i (t.infoticketID)}
      {#if !t.done}
        <div class="collapse collapse-sm collapse-arrow bg-[#ECECF7]">
          <input type="checkbox" class="peer" />
          <div class="collapse-title flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="text-sm md:text-lg font-semibold">Ticket {i + 1}</h3>
          </div>
          <div
            class="collapse-content bg-base-100 shadow-lg border boder-[1px]">
            {#if t}
              <DropdownForm
                bind:infoticket={t}
                bind:ticket
                increment={incrementTicketcount} />
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if}
