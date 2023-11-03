<script lang="ts">
  import { tabselected, tabs } from "$lib/stores/general-store";

  function selectTab(tab: string) {
    tabselected.set(tab);
  }
</script>

<div class="tabs pt-12 w-full">
  <div class="">
    {#if $tabs}
      {#each $tabs as tab, i (tab)}
        <button
          on:click={() => selectTab(tab)}
          class="tab tab-lifted text-xs md:text-[16px] font-medium px-6 md:px-12 {tab ===
          $tabselected
            ? 'tab-active '
            : ''}">
          {tab}
        </button>
      {/each}
    {/if}
  </div>
</div>
