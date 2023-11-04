<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import AlertBasic from "$lib/components/alert-basic.svelte";
  import { userData } from "$lib/stores/user-store";
  import { handleAuthError, setCookie, validateEmail } from "$lib/utils";

  let signUpForm = {
    name: "",
    lastname: "",
    email: "",
    password: "",
    passwordconfirm: "",
  };

  function signInWithGoogle() {
    console.log("signIn whit google");
  }

  let isFormValid = false;
  let message = "Usuario no válido";
  let className = "alert-error";
  let response = false;
  let isloading = false;

  function validateForm() {
    const { name, lastname, email, password, passwordconfirm } = signUpForm;

    const isNameValid = name.trim() !== "";
    const isLastNameValid = lastname.trim() !== "";
    const isEmailValid = email.trim() !== "" && validateEmail(email);
    const isPasswordValid = password?.length >= 8;
    const isPasswordConfirmValid = password === passwordconfirm;

    isFormValid =
      isNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordConfirmValid;
  }

  function handleInput() {
    validateForm();
  }
</script>

<div class="h-full flex flex-row justify-center items-center">
  <section
    class="bg-base-100 px-5 lg:px-[75px] shadow-lg w-[520px] h-[660px] rounded-l-[0px] lg:rounded-l-md rounded-r-[0px] lg:rounded-l-md mx-5 lg:mx-0 flex flex-col justify-start items-center">
    <div class="mb-3 mt-9 flex flex-col justify-center items-center">
      <div class="flex gap-4" />
      <h3 class="text-[20px] font-medium text-center text-black">
        Crea una cuenta
      </h3>
    </div>

    {#if response}
      <div class="relative w-[95%]">
        <div class="absolute -top-16 left-0 z-50 w-[95%]">
          <AlertBasic {className} {message} />
        </div>
      </div>
    {/if}

    <form
      class="flex flex-col gap-1 mb-6 mt-10"
      method="POST"
      use:enhance={() => {
        return async ({ result }) => {
          if (result?.data?.error) {
            message = handleAuthError(result.data.error);
            className = "alert-error";
            response = true;

            setTimeout(() => {
              response = false;
            }, 4000);
            isloading = false;
          } else {
            const user = result.data.userData;
            response = false;

            setCookie("userdata", user);
            goto("/home");
            isloading = false;
          }
        };
      }}>
      <div class="form-control flex flex-row gap-2">
        <div>
          <label class="label" for="name">
            <span class="font-medium text-[12px] text-black"
              >Nombre <span class="text-error">*</span></span>
          </label>
          <input
            bind:value={signUpForm.name}
            class="input input-bordered w-full h-[36px]"
            type="text"
            name="firstName"
            placeholder="Ingresa tu nombre"
            on:change={handleInput}
            on:input={handleInput}
            on:blur={handleInput} />
        </div>
        <div>
          <label class="label" for="lastname">
            <span class="font-medium text-[12px] text-black"
              >Apellidos <span class="text-error">*</span></span>
          </label>
          <input
            bind:value={signUpForm.lastname}
            class="input input-bordered w-full h-[36px]"
            type="text"
            name="lastName"
            placeholder="Ingresa tus apellidos"
            on:change={handleInput}
            on:input={handleInput}
            on:blur={handleInput} />
        </div>
      </div>

      <div>
        <label class="label" for="email">
          <span class="font-medium text-[12px] text-black"
            >Correo Electrónico <span class="text-error">*</span></span>
        </label>
        <input
          on:change={handleInput}
          on:input={handleInput}
          on:blur={handleInput}
          bind:value={signUpForm.email}
          class="input input-bordered w-full h-[36px]"
          type="email"
          name="email"
          placeholder="Tu correo electrónico" />
      </div>

      <div>
        <label class="label" for="password">
          <span class="font-medium text-[12px] text-black"
            >Contraseña <span class="text-error">*</span></span>
        </label>
        <input
          on:change={handleInput}
          on:input={handleInput}
          on:blur={handleInput}
          bind:value={signUpForm.password}
          class="input input-bordered w-full h-[36px]"
          name="password"
          type="password"
          placeholder="Elije una contraseña segura" />
      </div>
      <div>
        <label class="label" for="passwordconfirm">
          <span class="font-medium text-[12px] text-black"
            >Confirma tu contraseña <span class="text-error">*</span></span>
        </label>
        <input
          on:change={handleInput}
          on:input={handleInput}
          on:blur={handleInput}
          bind:value={signUpForm.passwordconfirm}
          class="input input-bordered w-full h-[36px] mb-4"
          type="password"
          placeholder="Confirma una vez más tu contraseña" />
      </div>

      <div class="flex justify-between items-center -mt-4 mb-3">
        <div class="label cursor-pointer flex items-center">
          <input
            type="checkbox"
            class="checkbox checkbox-xs checkbox-primary" />
          <span class="label-text font-[500] text-[12px] ml-2 text-[#7B848C]">
            Recordarme
          </span>
        </div>
        <a
          href="/reset-password"
          class="link link-primary link-hover text-[12px]">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        formaction="?/signUp"
        class="btn bg-[#D7E749] rounded-xl text-primary mt-8"
        disabled={!isFormValid || isloading}>
        Crear Cuenta
      </button>
    </form>

    <div class="flex flex-row justify-center items-center -mt-2">
      <p class="mr-2 text-[12px] font-[500] text-[#7B848C]">
        ¿Ya tienes una cuenta?
      </p>
      <a
        href="/sign-in"
        class="link link-primary link-hover text-[12px] font-[500]">
        Inicia sesión aquí.
      </a>
    </div>
  </section>
  <section
    class="w-[500px] h-[660px] hidden lg:flex flex-col justify-end items-center sign_up rounded-r-md overflow-hidden">
    <div class="flex flex-col mx-12 mb-12 gap-3">
      <img class="w-[180px]" src="/images/dtickers-logo.png" alt="" />
      <h4 class="text-[16px] font-[700] text-white mt-1">
        Ultrices mi enim viverra sit enim nisi molestie
      </h4>
      <small class="text-[14px] font-[500] text-white">
        Massa quam cursus feugiat fringilla. Eleifend risus nec malesuada sem
        dui accumsan vitae ut.
      </small>
    </div>
  </section>
</div>

<style>
  label > span {
    /* color: black; */
    margin-bottom: -5px;
  }

  .sign_up {
    background-image: url("/images/logo_signUp.png");
    background-size: cover;
  }
</style>
