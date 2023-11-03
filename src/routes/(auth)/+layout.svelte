<script lang="ts">
  import "../../app.css";
</script>

<div class="h-screen w-screen gradient block my-auto">
  <slot />
</div>

<style>
  .gradient {
    background: linear-gradient(135deg, #3d3eb4, #001028);
  }
</style>
