<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    currentOrderIDStore,
    currentOrderStore,
  } from "$lib/stores/cart-store";
  import { getOrderNumber } from "$lib/utils";

  export let cartorders: any = [];

  function setOrder(order: any) {
    currentOrderStore.set(order);
    currentOrderIDStore.set(order?.id);
    const r = getOrderNumber(order?.id);
    goto(`order-details/${r}/`);
  }
</script>

<div class="flex flex-col gap-3">
  {#each cartorders as order (order.id)}
    <!-- <pre>{JSON.stringify(order, null, 2)}</pre> -->

    <section
      class="bg-base-100 shadow-lg rounded-xl flex gap-4 p-5 items-between">
      <img
        src={order?.lineItems?.edges[0]?.node?.variant?.product?.featuredImage
          ?.url || "/images/flyer.png"}
        class="rounded-xl w-[104px] h-[104px]"
        alt="" />
      <div class="flex flex-col w-full">
        <div class="mt-1">
          <div class="flex justify-between">
            <small class="text-[11px] font-[500] text-[#7B848C] uppercase"
              >{order?.lineItems?.edges[0]?.node?.variant?.product
                .handle}</small>
            <small
              class="text-[12px] font-[500] uppercase {order?.financialStatus
                ? 'text-success'
                : 'text-error'}">{order?.financialStatus}</small>
          </div>
          <h2 class="text-[24px] font-[700]">
            {order?.lineItems?.edges[0]?.node?.variant?.product.title}
          </h2>
        </div>
        <div class="flex justify-between items-center mt-2">
          <p class="text-primary text-[16px] font-500">
            {#if order?.processedAt}
              {new Date(order?.processedAt).toLocaleString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            {:else}
              no definido
            {/if}
          </p>
          <button
            on:click={setOrder(order)}
            type="button"
            class="link link-secondary link-hover text-[16px] font-[500] underline">
            VER TICKETS
          </button>
        </div>
      </div>
    </section>
  {/each}
</div>
