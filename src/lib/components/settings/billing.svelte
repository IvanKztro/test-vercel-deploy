<script>
  import FactBilling from "../fact-billing.svelte";
</script>

<div class="mt-12 pb-[7rem]">
  <article class="flex flex-col md:flex-row mt-10">
    <div class="w-full md:w-[30%]">
      <h3 class="text-2xl font-semibold text-center md:text-start mb-5 md:mb-0">
        Datos de Facturación
      </h3>
    </div>
    <div class="w-full md:w-[70%]">
      <FactBilling />
    </div>
  </article>
</div>
