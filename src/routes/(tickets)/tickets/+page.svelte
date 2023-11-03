<script lang="ts">
  import ListEvents from "$lib/components/tickets/list-events.svelte";
  import { userData } from "$lib/stores/user-store.js";
  import { onMount } from "svelte";

  export let data;

  let filterType = "Current";
  let isloading = true;
  let cartorders: any = [];

  function handleFilter(type: string) {
    filterType = type;
    if (filterType === "Current")
      cartorders = data.orders
        ?.filter((order) => order.fbdata.eventData.status === "published")
        .reverse();
    else
      cartorders = data.orders
        ?.filter((order) => order.fbdata.eventData.status !== "published")
        .reverse();

    isloading = false;
  }

  function isEmpty(arr: any) {
    return arr?.length === 0;
  }

  onMount(() => {
    isloading = true;

    userData.set(data.user);
    handleFilter("Current");
  });
</script>

<div class="container mx-auto h-[80vh]">
  <section class="pt-12 flex gap-4">
    <article class="w-[25%] flex flex-col gap-8">
      <button
        on:click={() => handleFilter("Current")}
        class="text-[20px] block mr-auto {filterType === 'Current'
          ? 'text-black font-[700]'
          : 'text-primary font-[500]'}">
        Mis Tickets
      </button>
      <button
        on:click={() => handleFilter("Previous")}
        class="text-[20px] block mr-auto {filterType === 'Previous'
          ? 'text-black font-[700]'
          : 'text-primary font-[500]'}">
        Mis Tickets Anteriores
      </button>
    </article>
    <article class="w-[75%] overflow-y-auto h-[65vh] py-4 px-10">
      {#if isloading}
        <span
          class="loading loading-xl loading-spinner text-primary block mx-auto" />
      {:else}
        {#if filterType === "Current"}
          {#if isEmpty(cartorders)}
            <h5 class="text-primary text-[20px] font-semibold text-center mt-8">
              No tienes Tickets Recientes
            </h5>
          {:else}
            <ListEvents bind:cartorders />
          {/if}
        {/if}
        {#if filterType === "Previous"}
          {#if isEmpty(cartorders)}
            <h5 class="text-primary text-[20px] font-semibold text-center mt-8">
              No tienes Tickets Anteriores
            </h5>
          {:else}
            <ListEvents bind:cartorders />
          {/if}
        {/if}
      {/if}
    </article>
  </section>
</div>
