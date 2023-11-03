<script lang="ts">
  import CardTicket from "$lib/components/tickets/card-ticket.svelte";
  import EventInfo from "$lib/components/tickets/event-info.svelte";
  import {
    currentOrderIDStore,
    currentOrderStore,
  } from "$lib/stores/cart-store.js";
  import { userData } from "$lib/stores/user-store.js";
  import { onMount } from "svelte";

  export let data;
  let isloading = true;

  onMount(() => {
    isloading = true;

    userData.set(data.user);
    currentOrderStore.set(data.order);
    currentOrderIDStore.set(data.order.id);
    isloading = false;
  });
</script>

{#if isloading}
  <span
    class="loading loading-xl loading-spinner text-primary block mx-auto my-auto" />
{:else if $userData && data.order}
  <div class="container mx-auto bg-[#EBEBF7] h-full px-8 py-10">
    <EventInfo />
    <CardTicket />
  </div>
{:else}
  <h1 class="text-center text-[35px] -mx-8 bg-white mt-8">
    La orden no Existe
  </h1>
{/if}
