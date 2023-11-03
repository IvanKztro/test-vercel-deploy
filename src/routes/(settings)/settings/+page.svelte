<script lang="ts">
  import TabsSelect from "$lib/components/settings/tabs-select.svelte";
  import SectionGeneral from "$lib/components/settings/section-general.svelte";
  import Notifications from "$lib/components/settings/notifications.svelte";
  import { currentPageStore, tabselected } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store.js";
  import { onMount } from "svelte";
  import Billing from "$lib/components/settings/billing.svelte";

  export let data;

  onMount(() => {
    userData.set(data.user);
  });
</script>

<div class=" container mx-auto bg-base-100 flex justify-center">
  <div class="w-full md:w-[1200px] px-5 md:px-12 flex flex-col">
    <TabsSelect />

    {#if $tabselected === "General"}
      <SectionGeneral />
    {:else if $tabselected === "Notificaciones"}
      <Notifications />
    {:else if $tabselected === "Facturación"}
      <Billing />
    {/if}
  </div>
</div>
