<script lang="ts">
  import { ticketsJson, totalAmount } from "$lib/stores/cart-store";
  import { get } from "svelte/store";

  export let title = "";
  export let description = "";
  export let price = "";
  export let name = "";
  export let value = 0;
  export let isdeletable = false;

  let priceAsNumber: any;

  function increment() {
    value = value + 1;
    totalAmount.set($totalAmount + parseInt(price));
    const data = get(ticketsJson);
    if (data) data[name].value = value;
    ticketsJson.set(data);
  }

  function decrement() {
    if (value > 0) {
      value = value - 1;
      totalAmount.set($totalAmount - parseInt(price));
      const data = get(ticketsJson);
      if (data) data[name].value = value;
      ticketsJson.set(data);
    }
  }

  function deleteField() {
    let clonetickets = get(ticketsJson);
    let countdelete = clonetickets[name].value * parseInt(price);
    totalAmount.set($totalAmount - countdelete);

    delete clonetickets[name];
    ticketsJson.set(clonetickets);
  }

  function onInputChange(event: any) {
    const inputChar = event.key;
    const pattern = /^[0-9]*$/;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return;
    }
  }

  $: {
    if (price !== "") {
      priceAsNumber = parseFloat(price);
    }
  }
</script>

<section class="flex items-center justify-between gap-3">
  <div class="w-[70%] flex gap-3">
    {#if isdeletable}
      <button class=" mb-5 mr-1 md:mr-4" type="button" on:click={deleteField}>
        <img src="/icons/delete-ticket.svg" alt="" srcset="" class="w-6" />
      </button>
    {/if}
    <img src="/icons/ticket-2.svg" class="w-[30px] block mb-auto" alt="" />
    <div class="w-full">
      <p class="font-medium text-[12px]">{title}</p>
      <p class="w-[95%] font-medium">{description ? description : ""}</p>
    </div>
  </div>
  <div class="w-[30%] flex justify-end gap-3">
    <p class="block my-auto text-[16px] font-medium">
      ${priceAsNumber ? priceAsNumber.toFixed() : ""}
    </p>
    <div class="flex items-center">
      <button
        type="button"
        class="join-item min-h-9 h-9 bg-[#3D3EB41A] w-[32px] text-[#0C233F] text-base font-medium"
        on:click={decrement}>
        -
      </button>
      <input
        bind:value
        on:keypress={onInputChange}
        pattern="[0-9]*"
        class="join-item px-1 w-[20px] items-center flex justify-center truncate text-xs font-medium focus:outline-none bg-[#FFFFFF] disabled-input" />
      <button
        type="button"
        class="join-item min-h-9 h-9 bg-[#3D3EB41A] w-[32px] text-[#0C233F] text-base font-medium"
        on:click={increment}>
        +
      </button>
    </div>
  </div>
</section>
<div class="divider" />
