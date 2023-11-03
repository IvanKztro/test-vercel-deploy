<script lang="ts">
  import { currentEvent } from "$lib/stores/event-store";
  import FormTickets from "./form-tickets.svelte";

  let currentTab = "TICKETS";

  function changeTab(tab: any) {
    currentTab = tab;
  }
</script>

<div class="tabs mb-8 flex w-full mt-12">
  <button
    on:click={() => changeTab("TICKETS")}
    class="tab tab-lifted tab-md text-xs md:text-sm lg:text-[17px] {currentTab ===
    'TICKETS'
      ? 'tab-active text-primary'
      : ''}">
    Entradas
  </button>
  <button
    on:click={() => changeTab("PLACE")}
    class="tab tab-lifted tab-md text-xs md:text-sm lg:text-[17px] {currentTab ===
    'PLACE'
      ? 'tab-active text-primary'
      : ''}">
    ¿Dónde es?
  </button>
  <button
    on:click={() => changeTab("DESCRIPTION")}
    class="tab tab-lifted tab-md text-xs md:text-sm lg:text-[17px] {currentTab ===
    'DESCRIPTION'
      ? 'tab-active text-primary'
      : ''}">
    Descripción
  </button>
</div>

{#if currentTab === "TICKETS"}
  <FormTickets />
{/if}

{#if currentTab === "PLACE"}
  <p>-LIVE: {$currentEvent.fbdata.name}</p>
  <p>-Direccion: {$currentEvent.fbdata.address}</p>
  <p>-Lugar: {$currentEvent.fbdata.locationName}</p>
{/if}

{#if currentTab === "DESCRIPTION"}
  <p class="text-md font-medium">
    {$currentEvent?.description ||
      "Augue feugiat massa vitae faucibus sapien dui ultricies nisl nec. Rhoncus hac et tristique eu habitant id. Enim odio ut ultricies praesent faucibus. Lorem diam massa nibh ultrices viverra amet donec. Vitae integer enim tincidunt pellentesque pellentesque nascetur posuere."}
  </p>
{/if}
