<script lang="ts">
  import { setCurrentEvent } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";

  export let products: any;
  let currentSlide = 0;
  let interval: Interval | any;

  onMount(() => {
    clearInterval(interval);

    interval = setInterval(function () {
      nextSlide();
    }, 5000);
  });
  function nextSlide() {
    const numSlides = products?.length || 0;
    currentSlide = (currentSlide + 1) % numSlides;
  }

  function prevSlide() {
    const numSlides = products?.length || 0;
    currentSlide = (currentSlide - 1 + numSlides) % numSlides;
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="carousel w-full h-[280px] rounded-3xl overflow-hidden">
  {#if products}
    {#each products as item, j}
      <div
        class:hidden={currentSlide !== j}
        class="carousel-item relative w-full transition-transform transform translate-x-[calc(-100% * currentSlide)] ease-in-out duration-500">
        <section
          class="flex flex-col md:flex-row rounded-3xl w-full flex justify-between">
          <div
            class="flex flex-col justify-center items-center md:items-start w-full bgGradient h-[850px] md:h-auto">
            <div class="md:ml-[15%] flex flex-col items-center lg:items-start">
              <h2
                class="text-[48px] lg:text-[42px] font-bold text-white text-center lg:text-start mb-5 lg:mb-0 leading-10">
                {item?.title}
              </h2>
              <div class="flex gap-1 items-start font-medium text-[14px] mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-white">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span class="text-[14px] font-[500] text-white">
                  {item?.fbdata?.locationName ||
                    "Campo Lago, Costa Rica"}</span>
              </div>
              <button
                on:click={() => setCurrentEvent(item)}
                class="btn btn-neutral rounded-xl px-8 text-primary mt-5 font-medium"
                type="button">
                Ver Boletos
              </button>
            </div>
          </div>
          <img
            class="w-full lg:w-[350px] rounded-r-3xl hidden md:flex"
            src={item?.images?.edges[0]?.node?.originalSrc}
            alt={item?.title} />
        </section>
        <div
          class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button
            on:click={prevSlide}
            class="btn btn-circle btn-neutral btn-xs">
            ❮
          </button>
          <button
            on:click={nextSlide}
            class="btn btn-circle btn-neutral btn-xs">
            ❯
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .bgGradient {
    background-image: linear-gradient(
      to right bottom,
      #001028,
      #001837,
      #011f47,
      #062657,
      #112d67,
      #173173,
      #1e357f,
      #26398b,
      #2a3b95,
      #2f3ca0,
      #363daa,
      #3d3eb4
    );
  }

  .carousel-item {
    flex: 0 0 100%;
  }
</style>
