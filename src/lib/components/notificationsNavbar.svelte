<script lang="ts">
  import { notificationsStore } from "$lib/stores/general-store";
  // import format from "date-fns/esm/format/index";
  import { format } from "date-fns";
  import type { AppNotification } from "../../models/notifications";
  import es from "date-fns/locale/es/index.js";
  import { goto } from "$app/navigation";

  let notificationsToday: any = [];
  let notificationsMonth: any = [];
  let notificationsOthers: any = [];

  $: {
    if ($notificationsStore) {
      classifyNotifications();
    }
  }

  function classifyNotifications() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    $notificationsStore?.forEach((notification: AppNotification) => {
      const notificationDate = new Date(notification.date);
      const notificationMonth = notificationDate.getMonth();
      const notificationDay = notificationDate.getDate();

      if (
        notificationDay === currentDay &&
        notificationMonth === currentMonth
      ) {
        notificationsToday.push(notification);
      } else if (
        notificationMonth === currentMonth &&
        notificationDay !== currentDay
      ) {
        notificationsMonth.push(notification);
      } else if (notificationDate < currentDate) {
        notificationsOthers.push(notification);
      }
    });
  }

  function formatDate(date: any) {
    if (date) return format(date, "d MMM y • h:mm a", { locale: es });
    else return "";
  }

  function goToNotification(not: AppNotification) {
    if (not.link) goto(not.link);
  }
</script>

<div class="">
  <section class="flex flex-col gap-5">
    {#if notificationsToday?.length > 0}
      <h3 class="text-success text-lg">Hoy</h3>
    {/if}
    {#each notificationsToday as not (not.id)}
      <button
        class="flex gap-3 cursor-pointer hover:bg-gray-100 hover: rounded-lg hover:p-2"
        on:click={() => goToNotification(not)}>
        <div class="block mb-auto w-auto">
          <img
            src={`/icons/notifications/${not.icon}.svg`}
            alt=""
            class="w-7" />
        </div>
        <div class="flex flex-col gap-2 w-[80%] text-start">
          <small class="text-[#7B848C] font-[500] text-xs"
            >{formatDate(not.date)}</small>
          <h3 class="font-semibold text-[18px]">{not.title}</h3>
          <p class="text-[#7B848C] font-medium text-[16px]">
            {not.description}
          </p>
        </div>
      </button>
    {/each}
    {#if notificationsMonth?.length > 0}
      <h3 class="text-success text-lg">Este Mes</h3>
    {/if}
    {#each notificationsMonth as not (not.id)}
      <button
        class="flex gap-3 cursor-pointer hover:bg-gray-100 hover: rounded-lg hover:p-2"
        on:click={() => goToNotification(not)}>
        <div class="block mb-auto w-auto">
          <img
            src={`/icons/notifications/${not.icon}.svg`}
            alt=""
            class="w-7" />
        </div>
        <div class="flex flex-col gap-2 w-[80%] text-start">
          <small class="text-[#7B848C] font-[500] text-xs"
            >{formatDate(not.date)}</small>
          <h3 class="font-semibold text-[18px]">{not.title}</h3>
          <p class="text-[#7B848C] font-medium text-[16px]">
            {not.description}
          </p>
        </div>
      </button>
    {/each}
    {#if notificationsOthers?.length > 0}
      <h3 class="text-success text-lg">Pasadas</h3>
    {/if}
    {#each notificationsOthers as not (not.id)}
      <button
        class="flex gap-3 cursor-pointer hover:bg-gray-100 hover: rounded-lg hover:p-2"
        on:click={() => goToNotification(not)}>
        <div class="block mb-auto w-auto">
          <img
            src={`/icons/notifications/${not.icon}.svg`}
            alt=""
            class="w-7" />
        </div>
        <div class="flex flex-col gap-2 w-[80%] text-start">
          <small class="text-[#7B848C] font-[500] text-xs"
            >{formatDate(not.date)}</small>
          <h3 class="font-semibold text-[18px]">{not.title}</h3>
          <p class="text-[#7B848C] font-medium text-[16px]">
            {not.description}
          </p>
        </div>
      </button>
    {/each}
  </section>
</div>
