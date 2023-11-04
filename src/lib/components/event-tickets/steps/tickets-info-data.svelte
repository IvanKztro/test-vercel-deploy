<script lang="ts">
  export let tickets: any;
</script>

<div class="flex flex-col gap-3">
  <div class="collapse collapse-arrow bg-[#ECECF7]">
    <input type="checkbox" class="peer" />
    <div class="collapse-title flex items-center gap-3">
      <img src="/icons/ticket-2-purple.svg" class="w-8" alt="" />
      <h3 class="text-[20px] font-[700]">{tickets.title}</h3>
    </div>
    <div class="collapse-content bg-base-100 shadow-lg border border-[1px]">
      <div class="flex flex-col gap-2 mx-10 my-8">
        {#each Object.values(tickets.infoTickets) as t, i (t.identity + i)}
          <div>
            <section class="flex gap-2">
              <article class="w-[35%] flex gap-3 justify-start items-start">
                <img src="/icons/profile-circle.svg" class="w-6" alt="" />
                <h3 class="text-primary text-xl font-normal">
                  Ticket 0{i + 1}
                </h3>
              </article>
              <article class="w-[65%] grid grid-cols-2">
                <div class="flex flex-col gap-3">
                  <small class="text-[#7B848C] font-normal text-[8px]"
                    >NOMBRE</small>
                  <p class="text-[13px]">{t.name || "NONE"}</p>
                </div>
                <div class="flex flex-col gap-3">
                  <small class="text-[#7B848C] font-normal text-[8px]"
                    >APELLIDOS</small>
                  <p class="text-[13px]">{t.lastname || "NONE"}</p>
                </div>
                <div class="flex flex-col gap-3 mt-4">
                  <small class="text-[#7B848C] font-normal text-[8px]"
                    >CORREO ELECTRÓNICO</small>
                  <p class="text-[13px]">{t.email || "NONE"}</p>
                </div>
                <div class="flex flex-col gap-3 mt-4">
                  <small class="text-[#7B848C] font-normal text-[8px]"
                    >CEDULA DE IDENTIDAD</small>
                  <p class="text-[13px]">{t.identity || "NONE"}</p>
                </div>
              </article>
            </section>
            <div class="divider" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
