<script lang="ts">
  import { cartStore, productName, ticketsJson } from "$lib/stores/cart-store";
  import { deleteCookieData, getCookieData } from "$lib/utils";
  import AlertBasic from "../alert-basic.svelte";
  import InputNumber from "../input-number.svelte";
  import { goto } from "$app/navigation";
  import { position, steps } from "$lib/stores/general-store";
  import { get } from "svelte/store";
  import { userData } from "$lib/stores/user-store";
  import { currentEvent } from "$lib/stores/event-store";

  let totalTickets = 0;
  let hasError = false;
  let ticketsData: any = {};
  let className = "alert-error";
  let message = "Compra por lo menos un Ticket";
  let isloading = false;

  $: {
    if ($productName) {
      const res = getCookieData(
        `cart-order-${$productName}-${$userData.firebaseID}`
      );

      ticketsJson.set(res);
    }
  }

  $: {
    if ($ticketsJson) {
      ticketsData = get(ticketsJson);
    } else {
      ticketsData = {};
      $currentEvent.variants.edges.forEach((ticket: any) => {
        if (ticket.node.availableForSale)
          ticketsData[ticket.node.id] = {
            idVariantShopify: ticket.node.id,
            eventId: $currentEvent?.fbdata?.id,
            productId: $currentEvent?.fbdata?.productId,
            title: ticket.node.title,
            price: ticket.node.priceV2.amount,
            description: ticket.node.description,
            value: ticket.value || 0,
          };
      });
    }
  }

  function addAmountTicket() {
    totalTickets = 0;
    hasError = false;
    isloading = true;

    // Se inicializa la orden
    Object.values(ticketsData).forEach((ticket: any) => {
      if (ticket.value > 0) {
        totalTickets++;
      }
    });

    if (totalTickets === 0) {
      hasError = true;
      isloading = false;
      return;
    } else {
      hasError = false;
      ticketsJson.set(ticketsData);
      goto(`/event-tickets/${$productName ? $productName : "none"}`);
    }
  }

  function deleteForm() {
    deleteCookieData(`cart-order-${$productName}-${$userData?.firebaseID}`);
    deleteCookieData(`cart-${$productName}-id-${$userData?.firebaseID}`);
    deleteCookieData(`checkout-${$productName}-${$userData?.firebaseID}`);
    deleteCookieData(`checkout-process`);
    ticketsJson.set(null);
    const stepsT = [
      {
        title: "Reserva",
        ishere: true,
        position: 1,
      },
      {
        title: "Tickets",
        ishere: false,
        position: 2,
      },
      {
        title: "Confirmar y Pagar",
        ishere: false,
        position: 3,
      },
    ];
    steps.set(stepsT);
    position.set(1);
  }
</script>

{#if $cartStore && $ticketsJson}
  <div>
    <h4>Cuentas con una compra en proceso.</h4>
    <div class="mt-3">
      <a
        type="button"
        class="btn btn-neutral rounded-xl px-8"
        href={`/event-tickets/${$productName ? $productName : "none"}`}>
        <span class="text-[14px] font-medium"> Continuar </span>
      </a>

      <button
        on:click={deleteForm}
        type="button"
        class="btn btn-neutral rounded-xl px-8">
        <span class="text-[14px] font-medium"> Eliminar </span>
      </button>
    </div>
  </div>
{:else}
  <p class="text-[14px] font-medium">
    Selecciona el número de entradas y haz clic en “Agregar”. En la siguiente
    pantalla podrás proceder al pago.
  </p>
  <div class="divider" />
  <form>
    <div class="flex flex-col gap-5">
      {#each Object.values(ticketsData) as t}
        <InputNumber
          title={t.title}
          price={t.price}
          description={t.description}
          isdeletable={false}
          name={t.idVariantShopify}
          bind:value={t.value} />
      {/each}
    </div>
    {#if hasError}
      <AlertBasic {className} {message} />
    {/if}

    {#if isloading}
      <span
        class="loading loading-spinner loading-lg text-primary block mx-auto mt-7" />
    {:else}
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
        <img src="/images/creditcards_logo.png" alt="" srcset="" />
        <button
          on:click={addAmountTicket}
          type="button"
          class="btn btn-neutral rounded-xl px-6 md:px-4 lg:px-6 text-primary">
          <span class="text-[14px] md:text-[12px] lg:text-[14px] font-medium">
            Comprar Tickets
          </span>
        </button>
      </div>
    {/if}

    <div />
  </form>
{/if}
