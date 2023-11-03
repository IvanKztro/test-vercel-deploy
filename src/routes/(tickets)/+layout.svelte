<script lang="ts">
  import Footer from "$lib/components/footer.svelte";
  import NavBanner from "$lib/components/nav-banner.svelte";
  import NavBar from "$lib/components/nav-bar.svelte";
  import "../../app.css";
</script>

<NavBar />
<NavBanner />

<div class="bg-[#EBEBF7] px-8">
  <slot />
</div>

<Footer />
