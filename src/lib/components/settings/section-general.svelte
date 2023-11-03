<script lang="ts">
  import { userData } from "$lib/stores/user-store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import AlertBasic from "../alert-basic.svelte";
  import { enhance } from "$app/forms";
  import { setCookie } from "$lib/utils";
  import { goto } from "$app/navigation";
  import UploadPhoto from "./upload-photo.svelte";

  let haserrorprofile: boolean = false;
  let erroremail: boolean = false;
  let updatedprofile: boolean = false;

  let errorpassword: boolean = false;
  let updatedpass: boolean = false;
  let messagepass: string = "";

  let userForm = {
    firstname: "",
    lastname: "",
    email: "",
  };

  onMount(() => {
    userData.subscribe((data) => {
      if (!data) return;
      userForm.email = data.email;
      userForm.lastname = data.lastName;
      userForm.firstname = data.firstName;
    });
  });

  let userFormPassword = {
    newpassword: "",
    repeatpassword: "",
  };

  let userdeleting = false;

  function verififyResponse(data: any) {
    if (data.status === "error") {
      haserrorprofile = true;
      updatedprofile = false;
    } else {
      haserrorprofile = false;
      updatedprofile = true;
      setCookie("userdata", data.userData);
      const us = get(userData);
      if (us) {
        us.email = data.userData.email || "";
        us.firstName = data.userData.firstName || "";
        us.lastName = data.userData.lastName || "";
        userData.set(us);
      }
    }
  }

  function deleteUser() {}
</script>

<div class="mt-12 pb-[7rem]">
  <article class="flex flex-col md:flex-row">
    <div class="w-ful md:w-[30%]">
      <h3 class="text-2xl font-semibold">Información Personal</h3>
    </div>
    <div class="w-ful md:w-[70%]">
      {#if updatedprofile}
        <AlertBasic
          message="La información se ha actualizado!"
          className="alert-success mt-4" />
      {/if}
      {#if haserrorprofile}
        <AlertBasic
          message="Los datos a acutliazar son iguales"
          className="alert-error mt-4" />
      {/if}
      <div>
        <UploadPhoto />
      </div>
      <div class="mt-10">
        <form
          method="POST"
          use:enhance={({ formElement, formData, action, cancel }) => {
            return async ({ result }) => {
              verififyResponse(result.data);
            };
          }}>
          <div class="flex flex-col md:flex-row gap-0 md:gap-6">
            <div class="form-control w-full mb-6">
              <label class="label" for="name">
                <span class="font-meidum text-[14px] text-black"> Nombre </span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ingresa tu nombre"
                class="input input-bordered border-[#E0E0E0] bg-white border-[#E0E0E0] w-full"
                bind:value={userForm.firstname} />
            </div>
            <div class="form-control w-full mb-6">
              <label class="label" for="lastname">
                <span class="font-meidum text-[14px] text-black">
                  Apellido
                </span>
              </label>
              <input
                type="text"
                name="lastname"
                placeholder="Ingresa tus apellidos"
                class="input input-bordered border-[#E0E0E0] bg-white w-full"
                bind:value={userForm.lastname} />
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-0 md:gap-6">
            <div class="form-control w-full mb-6">
              <label class="label" for="email">
                <span class="font-meidum text-[14px] text-black">
                  Correo Electrónico
                </span>
              </label>
              <input
                type="text"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                class="input input-bordered border-[#E0E0E0] bg-white w-full {erroremail
                  ? 'input-error'
                  : ''}"
                bind:value={userForm.email} />
            </div>
            <div class="form-control w-full mb-6" />
          </div>

          <div class="form-control mb-6">
            <label
              class="label cursor-pointer flex flex-row justify-start gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary" />
              <span class="label-text text-base-200"
                >Envíe a esta dirección notificaciones por correo electrónico
                sobre errores que afecten a sus datos.</span>
            </label>
          </div>

          <button
            formaction="?/updateProfile"
            class="btn btn-neutral text-primary hover:opacity-50 rounded-xl block ml-auto mb-8"
            >Guardar Cambios</button>
        </form>
      </div>
    </div>
  </article>

  <article class="flex flex-col md:flex-row">
    <div class="w-ful md:w-[30%]">
      <h3 class="text-2xl font-semibold">Contraseña</h3>
    </div>
    <div class="w-ful md:w-[70%]">
      <form
        method="POST"
        use:enhance={({ formElement, formData, action, cancel }) => {
          return async ({ result }) => {
            if (result?.data?.status === "error") {
              errorpassword = true;
              updatedpass = false;
              messagepass = result.data.res;
            } else {
              errorpassword = false;
              updatedpass = true;
              messagepass =
                "Contraseña cambiada, vuelva a autenticarse en 3 segundos";
              setTimeout(() => {
                document.cookie = `userdata=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                goto("/sign-in");
              }, 3000);
            }
          };
        }}>
        {#if updatedpass}
          <AlertBasic message={messagepass} className="alert-success mt-4" />
        {/if}
        {#if errorpassword}
          <AlertBasic message={messagepass} className="alert-error mt-4" />
        {/if}
        <div class="flex flex-col md:flex-row gap-0 md:gap-6">
          <div class="form-control w-full">
            <label class="label" for="newpassword">
              <span class="font-meidum text-[14px] text-black">
                Nueva contraseña
              </span>
            </label>
            <input
              type="password"
              name="newpassword"
              minlength="8"
              placeholder="Ingresa tu nueva contraseña"
              class="input input-bordered border-[#E0E0E0] bg-white w-full {errorpassword
                ? 'border-error'
                : ''}"
              bind:value={userFormPassword.newpassword}
              required />
          </div>
          <div class="form-control w-full">
            <label class="label" for="repeatpassword">
              <span class="font-meidum text-[14px] text-black">
                Repetir contraseña
              </span>
            </label>
            <input
              type="password"
              name="repeatpassword"
              minlength="8"
              placeholder="Ingresa tu contraseña"
              class="input input-bordered border-[#E0E0E0] bg-white w-full {errorpassword
                ? 'border-error'
                : ''}"
              bind:value={userFormPassword.repeatpassword}
              required />
          </div>
        </div>
        <p class="label-text text-base-200 my-7">
          Mínimo 8 caractéres. Al menos un número, una mayúscula y/o caracter
          especial.
        </p>

        <button
          formaction="?/updatePassword"
          class="btn btn-neutral text-primary hover:opacity-50 rounded-xl block ml-auto px-7"
          >Cambiar</button>
      </form>
    </div>
  </article>
  <article class="flex flex-col md:flex-row mt-8">
    <div class="w-full md:w-[30%]">
      <h3 class="text-2xl font-semibold">Eliminar cuenta</h3>
    </div>
    <div class="w-full md:w-[70%]">
      <button
        class="btn btn-primary btn-outline rounded-xl block mr-auto px-7 mt-8 md:mt-0"
        onclick="modalDeleteAccount.showModal()"
        >Eliminar mi cuenta permanentemente</button>
    </div>
  </article>
</div>

<dialog id="modalDeleteAccount" class="modal">
  <form method="dialog" class="modal-box">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      >×</button>
    <div class="flex flex-col gap-4 justify-center items-center py-7">
      {#if !userdeleting}
        <img src="/src/static/images/sademoji.png" alt="" />
        <h2 class="text-warning text-2xl font-medium">Sentimos verte partir</h2>

        <p class="font-medium text-center">
          Si desea reducir sus notificaciones por correo electrónico, puede
          deshabilitarlas <span class="link link-info link-hover">aquí</span> o
          si solo desea cambiar su nombre de usuario, puede hacerlo
          <span class="link link-info link-hover">aquí</span>. Tenga en cuenta
          que la eliminación de la cuenta es definitiva. No habrá manera de
          restaurar su cuenta.
        </p>
        <div class="modal-action flex justify-between gap-4 my-6">
          <button class="btn btn-neutral rounded-xl text-primary px-6"
            >OLVÍDENLO</button>
          <form
            method="post"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.data.status === "success")
                  setTimeout(() => {
                    document.cookie = `userdata=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                    goto("/sign-in");
                  }, 3000);
              };
            }}>
            <input type="hidden" name="data" id="data" />
            <button
              formaction="?/deleteUser"
              class="btn btn-primary rounded-xl btn-outline px-6"
              on:click={deleteUser}>Eliminar mi cuenta</button>
          </form>
        </div>
      {/if}
      {#if userdeleting}
        <h4 class="text-3xl text-primary">Eliminado cuenta.</h4>
        <p>la sesión actual será cerrada en 5 segundos...</p>
        <span class="loading loading-spinner loading-lg text-primary" />
      {/if}
    </div>
  </form>
</dialog>
