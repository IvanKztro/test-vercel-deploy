<script lang="ts">
  import {
    productsStore,
    productsFilterStore,
    formsStore,
  } from "$lib/stores/event-store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  let tabs: any = [];
  export let typeSection: string;

  onMount(() => {
    const tabstemp: any = get(formsStore) || [];
    tabs = [
      {
        text: "Todos",
        value: "all",
        active: true,
      },
    ];
    tabstemp.forEach((tt) => {
      tabs.push({
        text: tt,
        value: tt,
        active: false,
      });
    });
  });

  let alltabs: boolean = true;
  let filterData: any[] = ["all"];

  function setActiveTab(payload: any) {
    filterData = [];
    const tabstest = [...tabs];
    if (payload.value === "all") {
      alltabs = !alltabs;
      tabstest.forEach((tab: any) => {
        tab.active = alltabs;
      });
      filterData = tabstest
        .filter((d: any) => d.active)
        .map((f: any) => f.value);
      tabs = [...tabstest];
      if (typeSection !== "filter") productsFilterStore.set(get(productsStore));
    } else {
      tabstest.forEach((tab: any) => {
        if (tab.value === payload.value) {
          tab.active = !tab.active;
        }
      });
    }
    filterData = tabstest.filter((d: any) => d.active).map((f: any) => f.value);
    tabs = [...tabstest];
    filterEvents(payload);
  }

  function filterEvents(payload: any) {
    const events: any = get(productsStore);

    const resevents = events.filter((event: any) =>
      filterData.includes(event.fbdata.category)
    );
    if (typeSection !== "filter") productsFilterStore.set(resevents);
  }

  function setAllTabs() {
    alltabs = !alltabs;
    setActiveTab({ value: "all", active: alltabs });
  }
</script>

<section
  class="  mt-9 {typeSection === 'filter'
    ? 'flex-wrap w-auto'
    : ' flex justify-between items-center'}">
  <div class="flex gap-3">
    {#each tabs as tab (tab.value)}
      <button
        on:click={() => setActiveTab(tab)}
        class="px-3 rounded-3xl text-primary cursor-pointer transition ease-in-out hover:-translate-y-1 text-[12px] text-center lg:text-[13px] font-[400]"
        class:bg-neutral={tab.active}
        class:bg-[#CFCFEC]={!tab.active}>
        <span>{tab.text}</span>
      </button>
    {/each}
  </div>
  <div class={typeSection === "filter" ? "hidden" : ""}>
    <button
      class="flex items-center text-sm font-medium gap-2 mt-2 cursor-pointer hover:bg-gray-100 hover:rounded-3xl px-2"
      on:click={setAllTabs}>
      <img src="/src/static/icons/showall.svg" class="w-" alt="" srcset="" />
      <span class="text-primary font-bold text-sm md:text-[14px]">
        {alltabs ? "Ocultar" : "Ver"} Todo
      </span>
    </button>
  </div>
</section>
