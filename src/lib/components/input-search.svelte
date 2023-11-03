<script lang="ts">
  import { searchStore } from "$lib/stores/event-store";
  import TabsMultiselect from "./tabs-multiselect.svelte";

  let tabs: any = [
    {
      text: "Top Eventos",
      value: "top",
      active: true,
    },
    {
      text: "Todos",
      value: "all",
      active: false,
    },
    {
      text: "Fiesta",
      value: "Fiesta",
      active: false,
    },
    {
      text: "Bar",
      value: "Bar",
      active: false,
    },
  ];
  let filterData: any[] = ["all"];
  let alltabs: boolean = false;
  let showMenu = false;

  let rangemaxprice = 40000;
  let rangeminprice = 1400;
  let rangecurrentprice = 6900;

  let rangemaxlocation = 64;
  let rangeminlocation = 8;
  let rangecurrentlocation = 12;
  // let search = "";

  function setActiveTab(payload: any) {
    filterData = [];
    const tabstest = [...tabs];
    if (payload.text === "all")
      tabstest.forEach((tab: any) => {
        tab.active = payload.allstatus;
      });
    else
      tabstest.forEach((tab: any) => {
        if (tab.text === payload.text) {
          tab.active = !tab.active;
        }
      });

    filterData = tabstest.filter((d: any) => d.active).map((f: any) => f.value);
    tabs = [...tabstest];
  }

  function setAllTabs() {
    alltabs = !alltabs;
    setActiveTab({ text: "all", allstatus: alltabs });
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function filterEvents() {
    console.log($searchStore);
  }
</script>

<div class="bg-base-100 join-item rounded h-11 flex py-3">
  <img src="/src/static/icons/search.svg" alt="search icon" class="ml-4 mr-3" />
</div>

<!-- on:change={filterEvents} -->
<!-- on:blur={filterEvents} -->
<input
  bind:value={$searchStore}
  class="input input-bordered join-item focus:outline-none rounded border-0 max-h-11 w-full pl-2"
  on:input={filterEvents}
  placeholder="Buscar" />

<div class="bg-base-100 join-item rounded h-11 flex py-3">
  <button on:click={toggleMenu}>
    <img
      src="/src/static/icons/search-settings.svg"
      alt="search icon"
      class="ml-4 mr-8" />
  </button>
</div>
<div
  class="bg-white max-w-full mt-4 z-30 p-5"
  style="display: {showMenu
    ? 'block'
    : 'none'}; position: absolute; top: 60px; width: 30%;">
  <h3>Filtros</h3>

  <h4 class="my-4">Categoriua de Evento</h4>
  <div class="flex flex-wrap gap-3">
    <TabsMultiselect typeSection="filter" />

    <!-- {#each tabs as tab}
      <button
        on:click={() => setActiveTab(tab)}
        class="px-3 rounded-3xl text-primary cursor-pointer transition ease-in-out hover:-translate-y-1 text-[12px] text-center lg:text-[13px] font-[400]"
        class:bg-neutral={tab.active}
        class:bg-[#CFCFEC]={!tab.active}>
        <span>{tab.text}</span>
      </button>
    {/each} -->
  </div>

  <h4 class="my-4">Rango de precio</h4>
  <input
    type="range"
    min={rangeminprice}
    max={rangemaxprice}
    bind:value={rangecurrentprice}
    class="range range-primary" />
  <div class="flex justify-between">
    <h3>${rangeminprice}</h3>
    <h3>${rangecurrentprice}</h3>
    <h3>${rangemaxprice}</h3>
  </div>

  <!--<h4 class="my-4">Lugar</h4>

  <select class="select select-bordered w-full w-full">
    <option disabled selected>Selecciona un lugar</option>
    <option>Costa Rica</option>
    <option>Estados Unidos</option>
  </select>

  <h4 class="my-4">Localización de Evento</h4>
  <input
    type="range"
    min={rangeminlocation}
    max={rangemaxlocation}
    bind:value={rangecurrentlocation}
    class="range range-primary" />
  <div class="flex justify-between">
    <h3>{rangeminlocation}km</h3>
    <h3>{rangemaxlocation}km</h3>
  </div> -->

  <div class="grid grid-cols-2 mt-5 gap-2">
    <button
      type="button"
      class="btn btn-outline btn-primary rounded-2xl h-[3.5rem]">
      BORRAR
    </button>
    <button
      type="button"
      class="btn btn-neutral text-primary rounded-2xl h-[3.5rem]">
      <div class="flex gap-3 items-center">
        <span> APLICAR </span>
      </div>
    </button>
  </div>
</div>
