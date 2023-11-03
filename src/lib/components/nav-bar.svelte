<script lang="ts">
  import { goto } from "$app/navigation";
  import { notificationsStore } from "$lib/stores/general-store";
  import { userData } from "$lib/stores/user-store";
  import { NotificationsStatus } from "../../models/notifications";
  import InputSearch from "./input-search.svelte";
  import NotificationsNavbar from "./notificationsNavbar.svelte";

  let showMenu = false;
  let notUnread = 0;

  $: {
    if ($notificationsStore && $notificationsStore?.length > 0) {
      notUnread = $notificationsStore.filter(
        (n: any) => n.status === NotificationsStatus.Unread
      ).length;
    }
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  async function logOut() {
    notificationsStore.set([]);
    document.cookie = `userdata=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    goto("/sign-in");
  }
</script>

<nav class="navbar-container w-full px-4 py-[24px] max-h-[96px]">
  <div class="navbar flex justify-start px-[5%] p-0 min-h-0">
    <div class="navbar-start">
      <div class="h-[24px] w-[250px]">
        <img
          src="/src/static/images/dtickets-logo-v2.svg"
          alt="DTicker"
          class="h-6 w-[190px]" />
      </div>
      <div
        class="divider divider-horizontal after:bg-base-100 before:bg-base-100 after:w-[1px] before:w-[1px] hidden lg:flex h-[50px]" />
      <div class="w-full hidden lg:flex lg:flex-col">
        <div class="join w-full max-w-full mt-1">
          <InputSearch />
        </div>
      </div>
    </div>
    {#if $userData}
      <div class="navbar-end">
        <div class="drawer drawer-end w-20">
          <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <label for="my-drawer-4" class="drawer-button btn btn-ghost">
              <div class="indicator mr-8 hidden lg:flex">
                <span
                  class="indicator-item badge badge-info text-neutral-100 badge-sm px-1 translate-x-[6px] -translate-y-[5px]"
                  >{notUnread}</span>
                <img src="/src/static/icons/notification.svg" alt="bell icon" />
              </div>
            </label>
          </div>
          <div class="drawer-side z-50">
            <label for="my-drawer-4" class="drawer-overlay" />
            <ul class="menu p-4 w-[380px] h-full bg-base-100 text-base-content">
              {#if $notificationsStore?.length > 0}
                <NotificationsNavbar />
              {:else}
                <div
                  class="h-full flex flex-col justify-center items-center gap-5">
                  <img
                    src="/src/static/images/hasnotnotifications.png"
                    class="w-[154px] h-[151px]"
                    alt=""
                    srcset="" />
                  <h4 class="text-primary text-2xl text-center">
                    Todavía no tienes <br />notificaciones
                  </h4>
                </div>
              {/if}
            </ul>
          </div>
        </div>

        <div class="avatar hidden lg:flex">
          <div class="w-[48px] h-[48px] rounded-full">
            <img
              src="/src/static/images/userprofile.png"
              alt="userphoto"
              width="48"
              height="48" />
          </div>
        </div>

        <div class="pl-4 text-neutral-100 hidden lg:block">
          <p class="text-base font-medium">
            {$userData.firstName}
            {$userData.lastName}
          </p>
          <p class="text-xs font-medium">{$userData.email}</p>
        </div>
        <div class="dropdown dropdown-end h-[48px] ml-6 relative">
          <div class="flex items-center w-full h-full">
            <button class="btn btn-ghost btn-sm btn-circle">
              <img
                src="/src/static/icons/menu-arrow-down.svg"
                alt="arrow down" />
            </button>
          </div>
          <button
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a>Profile</a></li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li on:click={logOut}><a>Logout</a></li>
          </button>
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar-container {
    background: var(
      --gradients-gradient-01,
      linear-gradient(124deg, #001028 0%, #22367d 72.88%, #3d3eb4 100%)
    );
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.03);
  }
</style>
