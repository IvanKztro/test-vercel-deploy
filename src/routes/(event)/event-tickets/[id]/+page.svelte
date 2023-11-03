<script lang="ts">
  import InfoSummary from "$lib/components/event-tickets/steps/info-summary.svelte";
  import InfoTickets from "$lib/components/event-tickets/steps/info-tickets.svelte";
  import InfoPayment from "$lib/components/event-tickets/steps/info-payment.svelte";
  import Steps from "$lib/components/steps.svelte";
  import {
    cartStore,
    checkoutStore,
    productName,
    ticketsJson,
    totalAmount,
  } from "$lib/stores/cart-store";
  import { currentEvent, currentEventID } from "$lib/stores/event-store";
  import { position, steps } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store";
  import { getCookieData, getOrderNumber, setCookie } from "$lib/utils";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let data: any;

  function getTotalAmount() {
    let total = 0;
    if (!$ticketsJson) return;

    Object.values($ticketsJson).forEach((ticket: any) => {
      const plus = ticket.value * parseInt(ticket.price);
      total += plus;
    });
    totalAmount.set(total);
  }

  $: {
    if ($checkoutStore?.order) {
      const orderidfb = $checkoutStore.customAttributes[0].key;
      const r = getOrderNumber($checkoutStore?.order.id);
      goto(
        `/validate-purchase/${r}?orderid=${orderidfb}&productname=${data.productname}`
      );
    }
  }

  onMount(() => {
    userData.set(data.user);
    productName.set(data.productname);
    currentEvent.set(data.event);
    cartStore.set(data.cart);
    currentEventID.set(data.event.id);

    if (data?.checkout)
      setCookie(
        `checkout-${$productName}-${$userData.firebaseID}`,
        data?.checkout
      );

    const res = getCookieData(
      `cart-order-${data.productname}-${$userData.firebaseID}`
    );
    if (res) {
      ticketsJson.set(res);
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
    getTotalAmount();

    if (!$ticketsJson) {
      window.history.back();
    }
  });
</script>

<div class="flex flex-col pt-[3rem] pb-[1.5rem] bg-[#ECECF7]">
  <div class=" block mx-auto">
    <Steps />
  </div>

  <section class="mt-8">
    {#if $position === 1}
      <div class="container mx-auto mx-5 lg:mx-8">
        <InfoSummary />
      </div>
    {:else if $position === 2}
      <div class="bg-base-100">
        <InfoTickets />
      </div>
    {:else if $position === 3}
      <div>
        <InfoPayment />
      </div>
    {/if}
  </section>
</div>
