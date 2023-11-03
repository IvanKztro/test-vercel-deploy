<script lang="ts">
  import { steps } from "$lib/stores/general-store";
</script>

<ul class="steps steps-horizontal w-full lg:w-[750px]">
  {#each $steps as step (step.position)}
    <li class="step {step.ishere ? 'step-primary' : 'step-[#7B848C]'}">
      <p
        class="text-xs md:text-lg {step.ishere
          ? 'text-primary'
          : 'text-[#7B848C]'}">
        {step.title}
      </p>
    </li>
  {/each}
</ul>

<style>
  .step::after {
    height: 1.5rem;
    width: 1.5rem;
    color: #7b848c;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
  }

  .step:not(.step-primary)::after,
  .step::before {
    background-color: #f2f4f7;
  }

  .step-primary::after {
    color: #fff;
  }
</style>
