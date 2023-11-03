<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  let products: any;

  onMount(() => {
    products = data.products.edges;
  });

  let eventselected: any;
  let errorlabel = false;

  function handleSelectEvent() {
    goto(`/check-ticket/${eventselected.fbdata.id}`);
  }
</script>

<div class="container mx-auto my-10">
  <h2>Sección para validar tickets vendidos</h2>

  <label for="country">
    <span class="font-meidum text-[14px] text-black">
      Evento<span class="text-error">*</span>
    </span>
  </label>

  <select
    bind:value={eventselected}
    name="country"
    class="select select-bordered w-full mt-1 {errorlabel
      ? 'border-red-500'
      : ''}">
    <option value="" selected>Selecciona un evento</option>
    {#if products && products?.length > 0}
      {#each products as product (product.id)}
        <option value={product}>
          {product.title}
        </option>
      {/each}
    {/if}
  </select>
  {#if errorlabel}
    <small class="text-xs text-error">Debes seleccionar un evento</small>
  {/if}

  <button
    type="button"
    on:click={handleSelectEvent}
    disabled={!eventselected}
    class="btn btn-neutral text-primary hover:opacity-50 rounded-xl block ml-auto my-10">
    Aceptar
  </button>
</div>
