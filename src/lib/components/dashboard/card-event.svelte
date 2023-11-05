<script lang="ts">
  // import format from "date-fns/esm/format/index";
  import { format } from "date-fns";
  import es from "date-fns/locale/es/index";
  import { setCurrentEvent } from "$lib/utils";
  import { productsFilterStore } from "$lib/stores/event-store";

  function formatDate(date: any) {
    if (date) return format(date, "MMMM dd, yyyy", { locale: es });
    else return "";
  }
</script>

<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-6">
  {#each $productsFilterStore as product}
    {#if product}
      <button
        on:click={() => setCurrentEvent(product)}
        class="transition ease-in-out hover:-translate-y-2 cursor-pointer">
        <div
          class="card text-white max-h-[600px] h-[600px]"
          style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url('{product
            ?.images?.edges[0]?.node?.originalSrc
            ? product.images.edges[0].node.originalSrc
            : '/images/events/default.png'}') no-repeat center center / cover;">
          <div class="card-body relative justify-center">
            <h2 class="uppercase font-bold text-[64px] text-center w-full">
              KPGS
            </h2>
            <div class="uppercase text-base font-bold text-center">
              {product?.title}
            </div>
            <div class="badge badge-neutral mx-auto mt-6 text-primary">
              {product?.fbdata?.category || "Event"}
            </div>
          </div>
        </div>
        <section class="flex flex-col justify-between gap-2">
          <div class="mt-2 flex justify-between">
            <h3 class="text-[#362BAD] font-medium text-[14px]">
              {formatDate(product.fbdata.startDate)}
            </h3>
            <h3 class="text-error font-medium text-[14px]">
              {formatDate(product.fbdata.endDate)}
            </h3>
          </div>
          <div class="text-black uppercase text-start font-bold text-[20px]">
            {product?.fbdata?.address
              ? product?.fbdata?.address
              : "Vestibulum felis eu netus nullam habitasse "}
          </div>
          <div class="flex items-center text-sm font-medium gap-2">
            <img src="/icons/map-purple.svg" alt="" />
            <span class="text-primary font-medium text-[14px]">
              {product?.fbdata?.locationName
                ? product?.fbdata?.locationName
                : "San José, Costa Rica"}</span>
          </div>
        </section>
      </button>
    {/if}
  {/each}
</section>
