<script>
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import AlertBasic from "$lib/components/alert-basic.svelte";
  import { validateEmail } from "$lib/utils";
  let response = false;
  let message = "Se ha enviado un correo para restablecer la contraseña";
  let className = "alert-success";
  let haserror = true;

  let forgotPasswordForm = {
    email: "",
  };

  function handleInput() {
    haserror =
      forgotPasswordForm.email.trim() !== "" &&
      validateEmail(forgotPasswordForm.email)
        ? false
        : true;
  }
</script>

<div
  class="forgot-password w-full h-full flex flex-row justify-center items-center px-5 lg:px-0">
  <section class=" bg-base-100 rounded-lg card">
    <p
      class="text-[20px] font-medium text-black text-center mt-10 mb-7"
      style="margin-top: 40px; margin-bottom:28px;">
      ¿Olvidaste tu contraseña?
    </p>
    {#if response}
      <AlertBasic {className} {message} />
    {/if}

    <form
      class="flex flex-col"
      method="POST"
      use:enhance={() => {
        return async ({ result }) => {
          const mm =
            result.data?.body?.data?.customerRecover?.customerUserErrors[0]
              ?.message;
          if (mm) {
            message = "Error al restablecer contraseña";
            className = "alert-error";
            response = true;
          } else {
            message = "Se ha enviado un correo para restablecer la contraseña";
            className = "alert-success";
            response = true;
          }
          setTimeout(() => {
            response = false;
            goto("sign-in");
          }, 4000);
          if (result.type === "error") {
            await applyAction(result);
          }
        };
      }}>
      <div class="form-control w-full">
        <label for="email" class="" style="margin-bottom: 4px;">
          <span class="font-meidum text-[14px] text-black">
            Correo electrónico
          </span>
          <span class="text-error">*</span>
        </label>
        <input
          bind:value={forgotPasswordForm.email}
          on:change={handleInput}
          on:input={handleInput}
          on:blur={handleInput}
          class="input input-bordered w-full"
          type="email"
          name="email"
          placeholder="Ingresa tu correo electrónico" />
      </div>
      <button
        disabled={haserror}
        formaction="?/resetPassword"
        type="submit"
        class="btn bg-[#D7E749] text-primary rounded-xl"
        style="margin-top: 20px;">
        Solicita contraseña
      </button>
    </form>

    <div
      class="flex flex-row justify-center items-center mt-0 lg:mt-3 mb-6 lg:mb-10">
      <p class="text-[#7B848C] text-[12px] mr-2 font-[500]">Ó</p>
      <a
        href="/sign-in"
        class="link link-primary link-hover text-[12px] font-[500]">
        Inicia sesión
      </a>
    </div>
  </section>
</div>

<style>
  .forgot-password {
    background-image: url("/src/static/images/resetpassword_imagen.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card {
    width: 480px;
    margin-top: 55px;
  }

  form {
    margin-top: 15px;
    margin-bottom: 15px;
    padding-right: 46px;
    padding-left: 46px;
  }
</style>
