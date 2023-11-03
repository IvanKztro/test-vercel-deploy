<script lang="ts">
  import { currentPageStore } from "$lib/stores/general-store";
  import { detectCurrentPage } from "$lib/utils";
  import { onMount } from "svelte";

  let routes = [
    { path: "/home", label: "Inicio", icon: "home" },
    { path: "/tickets", label: "Tickets", icon: "ticket" },
    { path: "/settings", label: "Configuración", icon: "settings" },
  ];

  let w: any;

  onMount(() => {
    w = window as any;
  });

  function active(link: any) {
    if (w) return link.path === w.location.pathname;
    return false;
  }
</script>

<section class="nav-banner py-4">
  <ul class=" tabs h-full relative flex-nowrap gap-2">
    {#each routes as link}
      <a
        href={link.path || ""}
        class="tab py-4 px-2 md:px-6 h-auto w-full gap-4"
        class:font-bold={active(link)}
        class:font-medium={!active(link)}>
        <img
          class="w-7 md:w-6"
          src="/src/static/icons/navbar/{link.icon}.svg"
          alt="" />
        <span class="hidden md:inline text-secondary text-sm md:text-lg">
          {link.label}
        </span>
      </a>
    {/each}
  </ul>
</section>

<style>
  .nav-banner {
    background: var(--accent, #d7e749);
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.03);
  }
</style>
