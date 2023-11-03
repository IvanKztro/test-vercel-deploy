<script lang="ts">
  import Gallery from "$lib/components/event/gallery.svelte";
  import Map from "$lib/components/event/map.svelte";
  import TabDetails from "$lib/components/event/tab-details.svelte";
  import EventsList from "$lib/components/events-list.svelte";
  import {
    cartStore,
    checkoutStore,
    productName,
  } from "$lib/stores/cart-store.js";
  import { currentEvent, currentEventID } from "$lib/stores/event-store.js";
  import { userData } from "$lib/stores/user-store.js";
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import { getOrderNumber, setCookie } from "$lib/utils.js";
  import { goto } from "$app/navigation";

  export let data;
  const products = data?.products.edges;

  console.log(data.checkout);
  onMount(() => {
    userData.set(data.user);
    productName.set(data.productname);
    currentEvent.set(data.event);
    currentEventID.set(data.event.id);
    cartStore.set(data.cart);

    if (data.checkout) {
      setCookie(
        `checkout-${$productName}-${$userData.firebaseID}`,
        data?.checkout
      );
      checkoutStore.set(data.checkout);
      console.log(data.checkout);
    }
  });

  $: {
    console.log($checkoutStore?.order);
    if ($checkoutStore?.order) {
      const orderidfb = $checkoutStore.customAttributes[0].key;
      const r = getOrderNumber($checkoutStore?.order.id);
      goto(
        `/validate-purchase/${r}?orderid=${orderidfb}&productname=${data.productname}`
      );
    }
  }

  function formatDate(date: any) {
    if (date) return format(date, "MMMM dd yyyy", { locale: es });
    else return "";
  }
</script>

<div class=" bg-white flex gap-3 px-8 lg:px-0">
  {#if $currentEvent}
    <section
      class=" w-full lg:w-[72%] flex flex-col gap-12 pt-[4rem] pr-0 lg:pr-12 bg-base-100 pl-0 lg:pl-[8%] pb-[10rem]">
      <article class="flex flex-col md:flex-row gap-12">
        <img
          src={$currentEvent?.images?.edges[0]?.node?.originalSrc}
          alt={$currentEvent?.title}
          class="w-full md:w-[334px] w-full md:h-[417px]" />
        <div>
          <h2 class="text-primary text-[36px] lg:text-[48px] font-bold">
            {$currentEvent?.title || "Massa feugiat nibh"}
          </h2>
          <p class="text-[16px] font-[500]">
            {$currentEvent.description ||
              "Ac risus donec facilisi eu convallis tincidunt est aliquet at. Ultricies tellus turpis et adipiscing in velit donec. Volutpat sed accumsan sit maecenas suspendisse mauris congue leo. In massa aenean netus egestas sit ut. Ornare dui euismod amet habitasse nullam orci"}
          </p>
          <div class="flex flex-col gap-2 my-4 pl-6">
            <div class="flex items-center gap-2">
              <img src="/src/static/icons/calendar.svg" alt="" srcset="" />
              <h2 class="text-[20px] text-primary">Fecha</h2>
              <small class="text-primary">
                {formatDate($currentEvent?.fbdata?.startDate)} -
                {formatDate($currentEvent?.fbdata?.endDate)}
              </small>
            </div>
            <div class="flex items-center gap-2">
              <img src="/src/static/icons/time.svg" alt="" srcset="" />
              <h2 class="text-[20px] text-primary">Hora</h2>
              <small class="text-primary">
                {$currentEvent?.fbdata?.startHour}</small>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-neutral rounded-xl block mr-auto">
            <div class="flex gap-2 items-center">
              <img src="/src/static/icons/ticket.svg" alt="" srcset="" />
              <span class="text-primary font-bold text-md">Entradas</span>
            </div>
          </button>
          <TabDetails />
        </div>
      </article>

      <article>
        <Map />
        <br /> <br />
        <Gallery />
      </article>
    </section>
    <section class="w-[0px] lg:w-[28%] hidden lg:inline pl-6 bg-[#ECECF7]">
      <h4 class="text-primary font-medium text-md mt-8 mb-6">Top Eventos</h4>
      <div class="flex flex-col gap-2 overflow-y-auto h-max-[520px] w-auto">
        <div class="flex flex-col gap-2 overflow-y-auto h-[260px] items-start">
          {#if products}
            {#each products as product}
              {#if product.handle !== $productName}
                <EventsList bind:latestevent={product} />
              {/if}
            {/each}
          {/if}
        </div>
      </div>

      <h4 class="text-primary font-medium text-md mt-8 mb-6">Otros Eventos</h4>
      <div class="flex flex-col gap-2 overflow-y-auto h-max-[520px] w-auto">
        <div class="flex flex-col gap-2 overflow-y-auto h-[260px] items-start">
          {#if products}
            {#each products as product}
              {#if product.handle !== $productName}
                <EventsList bind:latestevent={product} />
              {/if}
            {/each}
          {/if}
        </div>
      </div>
    </section>
  {:else}
    <div class="flex flex-col justify-center items-center w-full gap-6">
      <h2 class="text-primary text-4xl mt-10">Este evento ya ha caducado</h2>
      <img src="/src/static/images/sademoji.png" alt="" />
    </div>
  {/if}
</div>
