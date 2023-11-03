<script lang="ts">
  // @ts-ignore
  import CardEvent from "$lib/components/dashboard/card-event.svelte";
  import MostPopular from "$lib/components/dashboard/most-popular.svelte";
  import EventsList from "$lib/components/events-list.svelte";
  import TabsMultiselect from "$lib/components/tabs-multiselect.svelte";
  import {
    productsStore,
    productsFilterStore,
    formsStore,
    searchStore,
  } from "$lib/stores/event-store.js";
  import {
    currentPageStore,
    notificationsStore,
  } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store";
  import { onMount } from "svelte";

  // @ts-ignore
  export let data;
  productsStore.set(data?.products?.edges);
  productsFilterStore.set(data?.products?.edges);
  formsStore.set(data?.forms.category);

  // console.log(data?.products?.edges);
  let filterevents = [];

  onMount(() => {
    const w = window as any;
    userData.set(data.user);
    currentPageStore.set(w.location.pathname);
  });

  $: {
    if (data.notifications) notificationsStore.set(data.notifications);
  }

  $: {
    if ($searchStore !== "") {
      // console.log(data?.products?.edges);
      filterevents = filterEvents();
    }
  }

  function filterEvents() {
    const searchTerm = $searchStore.toLowerCase();
    return data?.products?.edges.filter((item) => {
      return (
        item?.title?.toLowerCase().includes(searchTerm) ||
        item?.description?.toLowerCase().includes(searchTerm) ||
        item?.fbdata?.address?.toLowerCase().includes(searchTerm) ||
        item?.fbdata?.locationName?.toLowerCase().includes(searchTerm) ||
        item?.fbdata?.category?.toLowerCase().includes(searchTerm) ||
        item?.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    });
  }
</script>

<div class="container mx-auto px-5 md: px-0">
  {#if $searchStore !== ""}
    {$searchStore}
    <h3>BUSCANDO.... (TEST)</h3>
    {#each filterevents as fv}
      <h1>{fv.title}</h1>
    {/each}
  {:else}
    <div class="container mx-auto pb-[7rem] h-full">
      <section class="flex gap-7 flex-col lg:flex-row">
        <div class=" w-full lg:w-[78%]">
          <h4 class="text-sm font-medium text-primary mt-9 mb-4">
            Lo más popular
          </h4>
          {#if data.products.edges}
            <MostPopular bind:products={data.products.edges} />
          {/if}
        </div>
        <div class=" w-full lg:w-[22%]">
          <h4 class="text-sm font-medium text-primary mt-9 mb-4">
            Últimos eventos
          </h4>
          <div
            class="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto h-[200px] lg:h-[300px] lg:items-start">
            {#if data.products.edges}
              {#each data.products.edges as item}
                <EventsList bind:latestevent={item} />
              {/each}
            {/if}
          </div>
        </div>
      </section>
      {#if $productsFilterStore}
        <TabsMultiselect typeSection="home" />
        <div class="mt-5">
          <CardEvent />
        </div>
      {/if}
    </div>
  {/if}
</div>
