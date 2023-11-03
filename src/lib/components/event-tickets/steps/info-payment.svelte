<script lang="ts">
  import {
    cartStore,
    checkoutStore,
    productName,
    ticketsJson,
  } from "$lib/stores/cart-store";
  import { currentEvent } from "$lib/stores/event-store";
  import TicketsInfoData from "./tickets-info-data.svelte";
  import { enhance } from "$app/forms";
  import { userData } from "$lib/stores/user-store";
  import { getCookieData, setCookie } from "$lib/utils";
  import FactBilling from "$lib/components/fact-billing.svelte";
  import { onMount } from "svelte";

  //testing
  let lineItemsJSON: any;
  let cartOrder: any;
  let jsoncart: any;
  let lineItemsArray: any = [];
  let btncheckout: any = null;

  let totaltickets: number = 0;
  let w: any;
  let checkoutid: string;

  let checkoutData = getCookieData(
    `checkout-${$productName}-${$userData.firebaseID}`
  );
  checkoutStore.set(checkoutData);

  onMount(() => {
    const data = {
      totalAmount: $cartStore?.estimatedCost?.totalAmount?.amount,
      totalTickets: totaltickets,
      createdBy: $userData?.firebaseID,
      eventId: $currentEvent?.fbdata?.id,
      productId: $currentEvent?.fbdata?.productId,
      status: "Pending",
      iseditable: true,
    };

    cartOrder = JSON.stringify(data);
  });

  $: {
    if ($ticketsJson) {
      totaltickets = 0;
      const res = getCookieData(
        `cart-order-${$productName}-${$userData.firebaseID}`
      );

      lineItemsArray = [];
      Object.values(res).forEach((item: any) => {
        if (item.value && item.value > 0) {
          totaltickets += item.value;

          lineItemsArray = [
            ...lineItemsArray,
            {
              quantity: item.value,
              variantId: item.idVariantShopify,
            },
          ];
        }
      });

      lineItemsJSON = JSON.stringify(lineItemsArray);
      jsoncart = JSON.stringify(res);
    }
  }

  function payCheckout() {
    setCookie(`checkout-process`, { status: "checking", event: $productName });

    w = window as any;
    w.location.href = $checkoutStore.webUrl;
  }
</script>

<div class="flex justify-center pb-[5rem]">
  <div class="w-[1200px] bg-base-100 rounded-lg px-[5rem]">
    {#if $userData.billing}
      <h2 class="text-center text-primary font-semibold text-2xl my-8">
        Resumen de la Compra
      </h2>

      <div class="flex flex-col gap-3">
        {#each Object.values($ticketsJson) as t}
          <TicketsInfoData tickets={t} />
        {/each}
      </div>
      <form
        class="flex flex-col gap-6 my-8"
        method="POST"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.data.status === "success") {
              setCookie(
                `checkout-${$productName}-${$userData.firebaseID}`,
                result?.data?.checkout
              );
              checkoutStore.set(result?.data?.checkout);
              payCheckout();
            }
          };
        }}>
        <div class=" flex flex-col gap-3">
          <div class="flex justify-between">
            <h3 class="text-primary text-xl font-semibold">
              Monto Total: ${$cartStore?.estimatedCost?.totalAmount?.amount}0
            </h3>
            <input
              type="hidden"
              name="lineItems"
              id="lineItems"
              bind:value={lineItemsJSON} />
            <input
              type="hidden"
              name="cartOrder"
              id="cartOrder"
              bind:value={cartOrder} />
            <input
              type="hidden"
              name="jsoncart"
              id="jsoncart"
              bind:value={jsoncart} />
            {#if $checkoutStore}
              <button
                type="button"
                on:click={payCheckout}
                class="btn btn-neutral rounded-xl px-7 b">Pagar.</button>
            {:else}
              <button
                formaction="?/createCheckoutAction"
                class="btn btn-neutral rounded-xl px-7 b">Pagar</button>
            {/if}
          </div>
        </div>
      </form>
    {:else}
      <h2 class="text-center text-primary font-semibold text-2xl my-8">
        Antes de comprar ingreso datos de facturación
      </h2>
      <FactBilling isbuy={true} />
    {/if}
  </div>
</div>
