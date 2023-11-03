<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import AlertBasic from "$lib/components/alert-basic.svelte";
  import { handleAuthError, setCookie } from "$lib/utils";

  let signInForm = {
    email: "",
    password: "",
  };

  let hasError = true;

  let message = "Usuario no válido";
  let className = "alert-error";
  let response = false;
  let isloading = false;

  const signInWithGoogle = () => {};
</script>

<div class="h-full gradient flex flex-row justify-center items-center">
  <section
    class="w-[500px] h-[660px] hidden lg:flex flex-col justify-end items-center sign_in rounded-l-md">
    <div class="flex flex-col mx-12 mb-12 gap-3">
      <img
        class="w-[180px]"
        src="/src/static/images/dtickers-logo.png"
        alt="" />
      <h4 class="text-[16px] font-[700] text-white mt-1">
        Ultrices mi enim viverra sit enim nisi molestie
      </h4>
      <p class="text-[14px] font-[500] text-white">
        Massa quam cursus feugiat fringilla. Eleifend risus nec malesuada sem
        dui accumsan vitae ut.
      </p>
    </div>
  </section>
  <section
    class="bg-base-100 pt-2 lg:pt-6 w-[500px] h-[500px] lg:h-[660px] px-5 lg:px-[4.5rem] shadow-lg h-[660px] rounded-r-[0px] lg:rounded-r-md rounded-r-[0px] lg:rounded-r-md mx-5 lg:mx-0 flex flex-col justify-center items-center">
    <div class="mb-4 -mt-4 flex flex-col justify-center">
      <div class="flex gap-4" />
      <h3 class="text-[20px] font-medium text-center text-black">
        Inicia sesión
      </h3>
    </div>
    {#if response}
      <div class="my-3 w-[80%]">
        <AlertBasic {className} {message} />
      </div>
    {/if}

    <form
      class="flex flex-col gap-3 mb-6 mt-8"
      method="POST"
      action="?/signIn"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.data?.error) {
            response = true;
            message = handleAuthError(result.data.error);
            setTimeout(() => {
              response = false;
            }, 4000);
            isloading = false;
          } else {
            const user = result.data.userData;

            setCookie("userdata", user);
            goto("/home");
            isloading = false;
          }
        };
      }}>
      <div>
        <label for="emailuser">
          <span class="font-meidum text-[14px] text-black">
            Correo electrónico<span class="text-error">*</span>
          </span>
        </label>
        <input
          bind:value={signInForm.email}
          class="input input-bordered w-full h-[36px] mt-1"
          type="email"
          name="emailuser"
          id="emailuser"
          placeholder="Ingresa tu correo electrónico o usuario" />
      </div>

      <div>
        <label for="passworduser">
          <span class="font-meidum text-[14px] text-black">
            Contraseña <span class="text-error">*</span>
          </span>
        </label>
        <input
          bind:value={signInForm.password}
          class="input input-bordered w-full h-[36px] mt-1"
          type="password"
          name="passworduser"
          id="passworduser"
          autocomplete="on"
          placeholder="Ingresa tu contraseña" />
      </div>

      <div class="flex justify-between items-center">
        <label for="checkreuser" class="label cursor-pointer">
          <input
            type="checkbox"
            id="checkreuser"
            name="checkreuser"
            autocomplete="on"
            class="checkbox checkbox-xs checkbox-primary" />
          <span class="font-[500] text-[14px] ml-2 text-[#7B848C]">
            Recordarme
          </span>
        </label>
        <a
          href="/reset-password"
          class="link link-primary link-hover text-[14px]">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        type="submit"
        disabled={isloading}
        class="btn btn-neutral rounded-xl text-primary mt-8">
        Iniciar sesión
      </button>
    </form>

    <div class="flex flex-row justify-center items-center -mt-2">
      <p class="mr-2 text-[14px] font-[500] text-[#7B848C]">
        ¿Todavía no tienes cuenta?
      </p>
      <a
        href="/sign-up"
        class="link link-primary link-hover text-[14px] font-[500]">
        Crea tu cuenta aquí.
      </a>
    </div>
  </section>
</div>

<style>
  label > span {
    margin-bottom: -5px;
  }

  .sign_in {
    background-image: url("/src/static/images/logo_signIn.png");
    background-size: cover;
  }

  .gradient {
    background: linear-gradient(135deg, #3d3eb4, #001028);
  }
</style>
