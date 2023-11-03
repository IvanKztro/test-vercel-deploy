<script lang="ts">
  export let message: string = "";
  export let className: string = "";
</script>

<div
  class=" alert w-full lg:w-[90%] block mx-auto flex justify-center {className
    ? className
    : ''}">
  <span class="text-start font-[500] text-[12px] lg:text-[12px]"
    >{message}
  </span>
</div>
