<script lang="ts">
  import {
    cartStore,
    checkoutStore,
    ticketsBuys,
    ticketsJson,
    totalAmount,
  } from "$lib/stores/cart-store.js";
  import { position, steps } from "$lib/stores/general-store.js";
  import { deleteCookieData } from "$lib/utils.js";
  import { onMount } from "svelte";
  export let data;

  let isloading = true;
  let orderexist = false;

  onMount(() => {
    orderexist = data?.order?.financialStatus === "PAID" ? true : false;
    if (orderexist) {
      deleteCookieData(`cart-${data.productname}-id-${data?.user?.firebaseID}`);
      deleteCookieData(`checkout-process`);
      deleteCookieData(
        `cart-order-${data.productname}-${data?.user?.firebaseID}`
      );
      deleteCookieData(
        `checkout-${data.productname}-${data?.user?.firebaseID}`
      );
      cartStore.set({});

      totalAmount.set(0);
      checkoutStore.set(null);

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

      setTimeout(() => {
        isloading = false;
      }, 2000);
    }
  });
</script>

<div class="flex justify-center items-center mt-12">
  {#if isloading}
    <div
      class="rounded-lg px-4 py-6 flex flex-col items-center gap-4 h-auto mt-[5rem]">
      <h2 class="text-2xl font-semibold">Validating purchase...</h2>
      <span class="loading loading-spinner text-primary loading-lg mt-3" />
    </div>
  {:else if orderexist}
    <div class="flex flex-col items-center gap-2">
      <img
        src="/src/static/images/pay_success.png"
        class="w-[200px] h-[206px] mb-[1.5rem]"
        alt="" />
      <h2 class="text-2xl text-center text-success font-bold my-2">
        ¡Genial! <br />Orden Completa
      </h2>
      <p class="text-base-200 text-center mb-3">
        Su pedido ahora está completo, el boleto electrónico ya se envió por
        correo <br />
        electrónico y puede verlo directamente en en la opción de Tickets.
      </p>
      <a href="/tickets" class="btn btn-neutral rounded-xl text-primary px-10"
        >IR A MIS TICKETS</a>
      <a
        href="/home"
        class="text-primary hover:link hover:link-primary font-medium"
        >Explorar más eventos</a>
    </div>
  {:else}
    <div class="flex flex-col items-center gap-2">
      <img
        src="/src/static/images/pay_denied.png"
        class="w-[200px] h-[206px] mb-[1.5rem]"
        alt="" />
      <h2 class="text-2xl text-error font-bold my-2">Ooops ¡Pedido fallido!</h2>
      <p class="text-base-200 text-center mb-3">
        No se pudo procesar su pago, verifique su conexión a <br />Internet y
        vuelva a intentarlo.
      </p>
      <button
        class="btn btn-neutral rounded-xl text-primary px-10 block mx-auto"
        >INTENTAR DE NUEVO</button>
      <a href="/" class="text-primary hover:link hover:link-primary font-medium"
        >Explorar más eventos</a>
    </div>
  {/if}
</div>
