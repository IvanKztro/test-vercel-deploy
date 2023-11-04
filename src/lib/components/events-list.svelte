<script lang="ts">
  import { setCurrentEvent } from "$lib/utils";

  export let latestevent: any;
</script>

<section
  class="flex flex-col lg:flex-row gap-2 lg:gap-2 items-end"
  style="min-width:130px;">
  <img
    class="rounded-2xl h-[80px] w-[80px] block mx-auto"
    src={latestevent?.images?.edges[0]?.node?.originalSrc}
    alt={latestevent?.title}
    srcset="" />

  <div class="flex flex-col justify-end">
    <div class="title-events">
      <h2
        class="text-[16px] font-medium mb-1 text-secondary mt-3 leading-[18px]">
        {latestevent?.title || "Massa feugiat nibh"}
      </h2>
      <div class="flex gap-[2px] items-start">
        <img src="/icons/map-purple.svg" class="w-3 mr-1" alt="" />
        <span class="text-[10px] font-medium text-secondary break-keep">
          {latestevent?.fbdata?.locationName || "Campo Lago, Costa Rica"}</span>
      </div>
    </div>
    <button
      class="link link-secondary link-hover font-medium seemore block mr-auto"
      tabindex="0"
      on:click={() => setCurrentEvent(latestevent)}>VER EVENTO</button>
  </div>
</section>

<style>
  .title-events {
    margin-bottom: 8px;
  }
  .seemore {
    font-size: 14px;
  }

  @media (min-width: 1198px) and (max-width: 1300px) {
    .title-events {
      margin-bottom: 4px;
    }

    .seemore {
      font-size: 12px;
    }
  }
</style>
