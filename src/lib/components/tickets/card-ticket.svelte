<script lang="ts">
  import {
    currentOrderIDStore,
    currentOrderStore,
  } from "$lib/stores/cart-store.js";
  import CodeQr from "./code-qr.svelte";

  $: {
    orderID = $currentOrderStore.orderNumber.toString();
    tickets = $currentOrderStore?.fbdata?.tickets;
    event = $currentOrderStore?.fbdata?.eventData;
    creator =
      $currentOrderStore?.lineItems?.edges[0].node?.variant?.product?.vendor ||
      "";
  }
  let tickets: any = [];
  let event: any;
  let creator: string = "";

  let ticketselected: any;
  let idticketselected: any;
  let orderID: string = "";

  function setDataTicket(ticket: any, i: any) {
    ticketselected = ticket;
    idticketselected = $currentOrderStore?.orderNumber + "-" + (i + 1);
  }
</script>

<div class="grid grid-cols-3 gap-6 mt-12 pb-[5rem]">
  {#if $currentOrderStore && tickets}
    {#each tickets as ticket, i (ticket?.infoticketID)}
      <div class="bg-base-100 rounded-2xl px-6 py-8">
        <h5 class="text-center text-[#3D3EB4] font-[500] text-[14px]">
          ID {ticket.infoticketID}
        </h5>
        <img
          src={$currentOrderStore?.lineItems?.edges[0].node?.variant?.product
            ?.featuredImage?.url
            ? $currentOrderStore?.lineItems?.edges[0].node?.variant?.product
                ?.featuredImage?.url
            : "/images/flyer.png"}
          class="w-full h-[300px] my-5 object-fill rounded-xl"
          alt="" />

        <small class="text-[#7B848C] font-[500] text-[10px]">EVENTO</small>
        <h2 class="text-black font-[700] text-[22px]">
          {$currentOrderStore?.lineItems?.edges[0].node?.variant?.product
            ?.title}
        </h2>

        <div class="flex flex-col gap-4 mt-4">
          <div class="grid grid-cols-2">
            <div>
              <small class="text-[#7B848C] font-[500] text-[10px]"
                >NOMBRE</small>
              <p class="text-[#232323] font-[600] text-[14px]">
                {ticket?.name}
                {ticket?.lastname}
              </p>
            </div>
            <div>
              <small class="text-[#7B848C] font-[500] text-[10px]"
                >ORGANIZADOR</small>
              <p class="text-[#232323] font-[600] text-[14px]">
                {$currentOrderStore?.lineItems?.edges[0].node?.variant?.product
                  ?.vendor}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2">
            <div>
              <small class="text-[#7B848C] font-[500] text-[10px]"
                >EMPIEZA</small>
              <p class="text-[#232323] font-[600] text-[14px]" />
              <p class="text-[#232323] font-[600] text-[14px]">
                {$currentOrderStore?.fbdata?.eventData?.startHour}
              </p>
            </div>
            <div>
              <small class="text-[#7B848C] font-[500] text-[10px]"
                >FINALIZA</small>
              <p class="text-[#232323] font-[600] text-[14px]" />
              <p class="text-[#232323] font-[600] text-[14px]">
                {$currentOrderStore?.fbdata?.eventData?.endHour}
              </p>
            </div>
          </div>

          <div class="border-dashed border-b-[2px] border-[#E5E5E5] pb-7">
            <small class="text-[#7B848C] font-[500] text-[10px]">LUGAR</small>
            <p class="text-[#232323] font-[600] text-[14px]">
              {$currentOrderStore?.fbdata?.eventData?.locationName}
            </p>
          </div>

          <div class="grid grid-cols-2 mt-5 gap-2">
            <button
              type="button"
              class="btn btn-ghost rounded-2xl h-[3.5rem]"
              on:click={() => setDataTicket(ticket, i)}
              onclick="modalCodeQR.showModal()">
              VER
            </button>
            <button
              type="button"
              class="btn btn-neutral text-primary rounded-2xl h-[3.5rem]">
              <div class="flex gap-3 items-center">
                <img
                  src="/icons/icon-download.svg"
                  class="w-5"
                  alt=""
                  srcset="" />
                <span> DESCARGAR </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<dialog id="modalCodeQR" class="modal">
  <form method="dialog" class="modal-box p-4 max-w-[400px]">
    <div class="">
      <CodeQr
        bind:creator
        bind:ticket={ticketselected}
        bind:event
        bind:orderID
        bind:idticket={idticketselected} />
    </div>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
