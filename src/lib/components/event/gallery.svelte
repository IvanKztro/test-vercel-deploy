<script lang="ts">
  const gallery: any = [
    "/src/static/images/events/bar.png",
    "/src/static/images/events/concierto.png",
    "/src/static/images/events/default.png",
    "/src/static/images/events/ev_privado.png",
    "/src/static/images/events/fiesta.png",
  ];
</script>

<div class="flex justify-between">
  <h3 class="text-primary font-semibold text-[20px] mb-3">Galería</h3>
  <p class="text-primary font-meidum text-[14px] mb-3 link link-hover">
    Ver Todo
  </p>
</div>

<div class="flex gap-4 h-full overflow-x-auto">
  {#each gallery as ga}
    <img src={ga} class="rounded-2xl w-[164px] h-[164px] cover" alt="" />
  {/each}
</div>

<style>
  .cover {
    min-width: 164px;
    min-height: 164px;
  }
</style>
