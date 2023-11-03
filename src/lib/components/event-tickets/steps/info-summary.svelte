<script lang="ts">
  import { currentEvent } from "$lib/stores/event-store";
  import FormDetails from "../form-details.svelte";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";

  function formatDate(date: any) {
    if (date) return format(date, "MMM dd, yyyy", { locale: es });
    else return "";
  }
</script>

{#if $currentEvent}
  <div class="flex flex-col lg:flex-row gap-2 pb-[5rem]">
    <section class="flex flex-col gap-1 w-full lg:w-[47%] px-7">
      <img
        src={$currentEvent?.images?.edges[0]?.node?.originalSrc}
        alt={$currentEvent?.title}
        class="h-[280px] coverii rounded-xl" />
      <h3
        class="text-primary text-[32px] md:text-[46px] font-bold mt-5 lg:mt-0">
        {$currentEvent?.title || "Massa feugiat nibh"}
      </h3>
      <p class="text-md font-medium text-[#7B848C]">
        {$currentEvent?.description ||
          "Ac risus donec facilisi eu convallis tincidunt est aliquet at. Ultricies tellus turpis et adipiscing in velit donec. Volutpat sed accumsan sit maecenas suspendisse mauris congue leo. In massa aenean netus egestas sit ut. Ornare dui euismod amet habitasse nullam orci"}
      </p>
      <article class="grid grid-cols-2 gap-5 mt-8">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <img src="/src/static/icons/calendar.svg" alt="" srcset="" />
            <p class="text-lg font-semibold text-primary">Fecha</p>
            <small class="text-primary">
              {$currentEvent?.fbdata?.startDate
                ? formatDate($currentEvent?.fbdata?.startDate)
                : ""} -
              {$currentEvent?.fbdata?.startDate
                ? formatDate($currentEvent?.fbdata?.endDate)
                : ""}
            </small>
          </div>
          <div class="flex items-center gap-2">
            <img src="/src/static/icons/time.svg" alt="" srcset="" />
            <p class="text-lg font-semibold text-primary">Hora</p>
            <small class="text-primary">
              {$currentEvent?.fbdata?.startHour}</small>
          </div>
          <div class="flex items-center text-sm font-medium gap-1">
            <img src="/src/static/icons/map-purple.svg" alt="" srcset="" />

            <p class="text-lg font-semibold text-primary">Lugar</p>
            <span class="text-primary font-medium text-sm">
              {$currentEvent?.fbdata?.address
                ? $currentEvent?.fbdata?.address
                : "San José, Costa Rica"}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <p>-LIVE DJs- Jürgen Dörsam & Maxx</p>
          <p>Info: +(506) 6469-7272</p>
          <p>Dresscode: Marina Resort</p>
        </div>
      </article>
    </section>
    <section class="w-full mt-5 lg:mt-0 lg:w-[53%]">
      <div class="bg-base-100 px-8 rounded-xl py-8">
        <FormDetails />
      </div>
    </section>
  </div>
{:else}
  <h4 class="text-center mt-7">Evento caducado o no existe</h4>
{/if}
