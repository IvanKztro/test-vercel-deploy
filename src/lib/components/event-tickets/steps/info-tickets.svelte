<script lang="ts">
  import { enhance } from "$app/forms";
  import AlertBasic from "$lib/components/alert-basic.svelte";
  import {
    totalAmount,
    ticketsJson,
    cartStore,
    productName,
    checkoutStore,
  } from "$lib/stores/cart-store";
  import { currentEvent } from "$lib/stores/event-store";
  import { position, steps } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store";
  import { getCookieData, setCookie } from "$lib/utils";
  import TicketsDropdown from "./tickets-dropdown.svelte";

  let hasError = false;
  let lineItemsArray: any = [];
  let lineItemsJSON: any;
  let checkoutData = getCookieData(
    `checkout-${$productName}-${$userData.firebaseID}`
  );
  checkoutStore.set(checkoutData);

  $: {
    if ($ticketsJson) {
      const res = getCookieData(
        `cart-order-${$productName}-${$userData.firebaseID}`
      );
      arraytickets = Object.values($ticketsJson);
      lineItemsArray = [];
      Object.values(res).forEach((item: any) => {
        if (item.value && item.value > 0)
          lineItemsArray = [
            ...lineItemsArray,
            {
              quantity: item.value,
              variantId: item.idVariantShopify,
            },
          ];
      });

      lineItemsJSON = JSON.stringify(lineItemsArray);
    }
  }

  function nextStep() {
    const res = hasFalseDone();

    if (res) {
      hasError = true;
      setTimeout(() => {
        hasError = false;
      }, 4000);
      return;
    }

    const stepsT = [
      {
        title: "Reserva",
        ishere: true,
        position: 1,
      },
      {
        title: "Tickets",
        ishere: true,
        position: 2,
      },
      {
        title: "Confirmar y Pagar",
        ishere: true,
        position: 3,
      },
    ];
    steps.set(stepsT);
    position.set(3);
  }

  let arraytickets: any;

  function hasFalseDone() {
    return Object.values($ticketsJson).some((t: any) => t?.done === false);
  }
</script>

<h3 class="text-center text-primary font-semibold text-[24px] py-[3.5rem]">
  Información de Tickets
</h3>

{#if $cartStore && arraytickets}
  <div
    class="flex flex-col-reverse lg:flex-row gap-5 pb-[5rem] container mx-auto">
    <section class="flex flex-col gap-5 w-full lg:w-[70%] px-7">
      <form
        method="POST"
        use:enhance={() => {
          return async ({ result }) => {
            setCookie(
              `checkout-${$productName}-${$userData.firebaseID}`,
              result?.data?.res?.body?.data?.checkoutCreate?.checkout
            );
            checkoutStore.set(
              result?.data?.res?.body?.data?.checkoutCreate?.checkout
            );
            nextStep();
          };
        }}>
        {#if hasError}
          <AlertBasic
            message="Hay tickets con información faltante"
            className="alert-error" />
        {/if}
        {#each arraytickets as ticket (ticket.idVariantShopify)}
          {#if !ticket.done}
            <TicketsDropdown
              bind:ticket
              bind:infoTickets={ticket.infoTickets} />
          {/if}
        {/each}

        <input
          type="hidden"
          name="lineItems"
          id="lineItems"
          bind:value={lineItemsJSON} />

        <button
          class="btn btn-neutral rounded-xl text-primary w-full mb-8 mt-7"
          on:click={nextStep}>
          Continuar a Formas de pago
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
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </form>
    </section>

    <section class="flex flex-col gap-1 w-full lg:w-[30%]">
      <img
        class=" block mx-auto lg:inline lg:mx-0 w-[70%] lg:w-full rounded-xl"
        src={$currentEvent?.images?.edges[0]?.node?.originalSrc}
        alt={$currentEvent?.title}
        srcset="" />

      <div class="flex flex-col gap-2 mx-3 mt-7">
        <div class="flex gap-2">
          <img
            src="/src/static/icons/ticket-2-purple.svg"
            class="w-8"
            alt=""
            srcset="" />
          <h2 class="text-primary text-[24px] font-bold">
            {$currentEvent?.title}
          </h2>
        </div>
        <div class="divider" />
        {#each Object.values($cartStore.lines.edges) as ticket, i (ticket.node.id)}
          <section class="flex gap-3 -my-4 px-3">
            <div class="flex justify-center items-center w-[20%]">
              <p class="text-lg font-semibold">
                {ticket.node.quantity}
              </p>
            </div>

            <div class="flex flex-col gap-1">
              <h4 class="text-[15px] font-medium">
                {ticket.node.merchandise.title}
              </h4>
              <p class="text-[15px] font-medium">
                {ticket?.node?.merchandise?.description
                  ? ticket.node.merchandise.description
                  : ticket.node.merchandise.title}
              </p>
            </div>

            <div
              class="block ml-auto my-auto text-primary text-xl font-semibold">
              <p>{ticket.node.estimatedCost.totalAmount.amount}</p>
            </div>
          </section>
          <div class="divider" />
        {/each}
      </div>
      <div />
      <div class="flex justify-between items-center px-5">
        <h2 class="text-primary text-[16px] font-bold">Monto Tickets</h2>
        <h2 class="text-primary text-[24px] font-bold">
          ${$totalAmount}.00
        </h2>
      </div>
      <div class="flex justify-between items-center px-5">
        <h2 class="text-primary text-[16px] font-bold">Monto Tax</h2>
        <h2 class="text-primary text-[24px] font-bold">
          ${parseInt($cartStore.estimatedCost.totalAmount.amount) -
            parseInt($totalAmount)}.00
        </h2>
      </div>
      <div class="flex justify-between items-center px-5">
        <h2 class="text-primary text-[16px] font-bold">Monto Total</h2>
        <h2 class="text-primary text-[24px] font-bold">
          ${$cartStore.estimatedCost.totalAmount.amount}0
        </h2>
      </div>
    </section>
  </div>
{/if}
