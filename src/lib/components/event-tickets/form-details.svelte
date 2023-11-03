<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    ticketsJson,
    totalAmount,
    productName,
    cartStore,
    checkoutStore,
  } from "$lib/stores/cart-store";
  import { position, steps } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store";
  import { generateOrderNumber, setCookie } from "$lib/utils";
  import InputNumber from "../input-number.svelte";

  let totalTickets = 0;
  let hasError = false;
  let totalamount = 0;
  let lines: any;

  let tickets: any = [];

  $: {
    if ($ticketsJson) {
      tickets = [];
      Object.values($ticketsJson).forEach((item) => {
        if (item.value > 0)
          tickets = [
            ...tickets,
            {
              merchandiseId: item.idVariantShopify,
              quantity: item.value,
            },
          ];
      });

      lines = JSON.stringify(tickets);
    }
  }

  $: {
    if (tickets?.length === 0) window.history.back();
  }

  function nextStep() {
    totalTickets = 0;
    totalamount = 0;
    hasError = false;

    if ($ticketsJson) {
      const filteredTickets: any = {};

      Object.values($ticketsJson).forEach((ticket: any) => {
        if (ticket.value > 0) {
          if (!filteredTickets[ticket.idVariantShopify]) {
            filteredTickets[ticket.idVariantShopify] = ticket;
            filteredTickets[ticket.idVariantShopify].infoTickets = {};
          }
          for (let i = 0; i < ticket.value; i++) {
            totalamount += parseInt(
              filteredTickets[ticket.idVariantShopify].price
            );
            const infoticketID = generateOrderNumber();
            filteredTickets[ticket.idVariantShopify].infoTickets[infoticketID] =
              {
                done: false,
                infoticketID,
                idVariantShopify: ticket.idVariantShopify,
                name: "",
                lastname: "",
                email: "",
                identity: "",
                phone: "",
                deel: false,
                confirmation: false,
              };
            totalTickets++;
          }
        }
      });

      if (totalTickets === 0) {
        hasError = true;
        return;
      } else {
        hasError = false;

        ticketsJson.set(filteredTickets);

        setCookie(
          `cart-order-${$productName}-${$userData.firebaseID}`,
          filteredTickets
        );

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
            ishere: false,
            position: 3,
          },
        ];
        steps.set(stepsT);
        position.set(2);
      }
    }
  }
</script>

<h3 class="text-[18px] md:text-[24px] font-semibold text-primary">
  Detalles de la compra
</h3>
<div class="divider" />
<form
  method="POST"
  use:enhance={() => {
    return async ({ result }) => {
      if (result?.data?.status === 200) {
        const cookiename = `cart-${result.data.eventname}-id-${$userData.firebaseID}`;
        setCookie(cookiename, result.data.data.cart.id);
        cartStore.set(result.data.cart);

        nextStep();
      } else {
        console.log("Error al crear el carrito");
      }
    };
  }}>
  <div class="flex flex-col gap-5">
    {#if $ticketsJson}
      {#each Object.values($ticketsJson) as ticket (ticket.idVariantShopify)}
        {#if ticket.value > 0}
          <InputNumber
            title={ticket.title}
            price={ticket.price}
            description={ticket.description}
            isdeletable={true}
            name={ticket.idVariantShopify}
            bind:value={ticket.value} />
        {/if}
      {/each}
    {/if}
  </div>
  <div class="flex justify-between items-center">
    <h3 class="text-primary text-[16px] font-semibold">Monto Total</h3>
    <h3 class="text-primary text-[24px] font-semibold">
      $ {$totalAmount}.00
    </h3>
  </div>
  <input class=" hidden" name="lines" bind:value={lines} />
  <button
    disabled={tickets?.length === 0}
    class="btn btn-neutral rounded-xl text-primary text-[11px] md:text-md w-full my-8"
    formaction="?/createCartAction">
    LLENAR INFORMACIÓN DE ASISTENCIA
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-4 md:w-6 h-4 md:h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
  </button>
</form>
