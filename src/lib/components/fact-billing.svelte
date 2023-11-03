<script lang="ts">
  import {
    getCities,
    getCountries,
    getStates,
    handleFormError,
    setCookie,
  } from "$lib/utils";
  import { onMount } from "svelte";
  import intlTelInput from "intl-tel-input";
  import "intl-tel-input/build/js/utils";
  import { enhance } from "$app/forms";
  import { userData } from "$lib/stores/user-store";
  import { get } from "svelte/store";
  import AlertBasic from "./alert-basic.svelte";
  let btn1: any = null;
  let btn2: any = null;

  let inputError: boolean = false;
  let phoneNumber: any = "";
  let isedit: boolean = false;
  let isphonevalid: boolean = false;
  let hasError: boolean = false;
  let message: string = "";

  // Initialize form fields
  let factform: any = {
    name: "",
    lastname: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    street: "",
    numberstreet: "",
    iscompany: "ssd",
    numberregister: "",
    terms: true,
  };

  let formstatus: any = {
    name: {
      error: false,
      message: "",
    },
    lastname: {
      error: false,
      message: "",
    },
    identity: {
      error: false,
      message: "",
    },
    phone: {
      error: false,
      message: "",
    },
    country: {
      error: false,
      message: "",
    },
    state: {
      error: false,
      message: "",
    },
    city: {
      error: false,
      message: "",
    },
    zip: {
      error: false,
      message: "",
    },

    street: {
      error: false,
      message: "",
    },
    numberstreet: {
      error: false,
      message: "",
    },
    iscompany: {
      error: false,
      message: "",
    },
    numberregister: {
      error: false,
      message: "",
    },
    terms: {
      error: false,
      message: "",
    },
  };

  function handleSend() {
    const res: any = validateData();
    if (!res) return;
    else btn2.click();
  }

  function validateData() {
    let res = true;
    for (const key in factform) {
      if (formstatus[key]) {
        formstatus[key] = {
          error: false,
          message: "",
        };

        const res2 = handleFormError(key);
        if (
          (factform[key] === "" && key !== "phone") ||
          (key === "phone" && !_phone?.valid) ||
          (typeof factform[key] === "boolean" && !factform[key])
        ) {
          formstatus[key] = {
            error: true,
            message: res2,
          };
          res = false;
        }

        if (key === "terms" && !factform[key]) {
          formstatus[key] = {
            error: true,
            message: res2,
          };
          res = false;
        }
      }
    }
    return res;
  }

  let countries: any[] = [];
  let states: any[] = [];
  let cities: any[] = [];

  let it: any = null;
  let _phone: any = { valid: false, value: "", error: "" };

  onMount(() => {
    countries = getCountries();
    setTimeout(() => {
      setRef("fact-billing");
    }, 10);
  });

  function setRef(id: string) {
    const input = document.querySelector(`#phoneticket-${id}`);
    if (input) {
      it = intlTelInput(input, {
        utilsScript: "./intl-tel-input/build/js/utils.js",
        separateDialCode: true,
      });
      input.addEventListener(`countrychange${id}`, () => {
        change();
      });
    }
  }

  function change() {
    if (it) {
      _phone.value = it.getNumber();
      _phone.error = it.getValidationError();
      _phone.valid = it.isValidNumber();
    }
    if (it.isValidNumber()) {
      phoneNumber = it.getNumber();
      isphonevalid = true;
    } else {
      phoneNumber = "";
    }
  }

  function onCountryChange() {
    states = getStates(factform.country);
    cities = [];
  }

  function onStateChange() {
    cities = getCities(factform.country, factform.state);
  }

  function getCountryName(isoCode: string): string {
    const country = getCountries().find((c) => c.isoCode === isoCode);
    return country ? country.name : "";
  }

  function getStateName(countryISO: string, stateISO: string): string {
    const states = getStates(countryISO);
    const state = states.find((s) => s.isoCode === stateISO);
    return state ? state.name : "";
  }

  function setData() {
    const user = get(userData);

    const {
      city,
      country,
      iscompany,
      lastname,
      name,
      numberregister,
      state,
      street1,
      street2,
      terms,
      zip,
    } = user?.billing;

    phoneNumber = user.billing.phoneNumber;

    factform = {
      city,
      country,
      iscompany,
      lastname,
      name,
      numberregister,
      phone: phoneNumber,
      state,
      street: street1,
      numberstreet: street2,
      terms,
      zip,
    };
    onCountryChange();
    onStateChange();
    setTimeout(() => {
      setRef("fact-billing");
    }, 10);

    isedit = true;
  }
</script>

{#if !$userData?.billing || isedit}
  {#if hasError}
    <AlertBasic {message} className="alert-error" />
  {/if}
  <form
    class="flex flex-col"
    method="POST"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.data?.error) {
          hasError = true;
          message = "Todos los campos son necesarios";
        } else {
          hasError = false;
          message = "Se ha actualizado con exito";
          const user = result.data.userData;
          setCookie("userdata", user);
          isedit = false;
          userData.set(user);
        }
      };
    }}>
    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="name">
          <span class="font-meidum text-[14px] text-black">
            Nombre<span class="text-error">*</span>
          </span>
        </label>
        <input
          class="input input-bordered w-full input-md mt-1 {formstatus.name
            .error
            ? 'border-red-500'
            : ''} "
          type="text"
          name="name"
          placeholder="Ingresa tu nombre"
          bind:value={factform.name} />
        {#if formstatus.name.error}
          <small class="text-xs text-error">{formstatus.name.message}</small>
        {/if}
      </div>
      <div>
        <label for="lastname">
          <span class="font-meidum text-[14px] text-black">
            Apellidos<span class="text-error">*</span>
          </span>
        </label>
        <input
          class="input input-bordered w-full input-md mt-1 {formstatus.lastname
            .error
            ? 'border-red-500'
            : ''} "
          name="lastName"
          type="text"
          placeholder="Ingresa tus apellidos"
          bind:value={factform.lastname} />
        {#if formstatus.lastname.error}
          <small class="text-xs text-error"
            >{formstatus.lastname.message}</small>
        {/if}
      </div>
    </section>
    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="email">
          <span class="font-meidum text-[14px] text-black">
            Correo Eléctronico<span class="text-error">*</span>
          </span>
        </label>
        <p class="mt-4">{$userData.email}</p>
      </div>
      <div>
        <label for="phone">
          <span class="font-meidum text-[14px] text-black">
            Número de Telefono<span class="text-error">*</span>
          </span>
        </label>
        <input
          id={"phoneticket-fact-billing"}
          bind:value={factform.phone}
          class="input input-bordered border-[#DBDEE2] bg-white w-full text-xs px-3 rounded {formstatus
            .phone.error
            ? 'border-red-500'
            : ''}"
          type="tel"
          name="phone"
          on:input={change}
          placeholder="Phone" />
        <input
          class="input input-bordered w-full input-md mt-1 hidden"
          type="text"
          placeholder="Ingresa tu telefono"
          name="phoneNumber"
          bind:value={phoneNumber} />
        {#if formstatus.phone.error}
          <small class="text-xs text-error">{formstatus.phone.message}</small>
        {/if}
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="country">
          <span class="font-meidum text-[14px] text-black">
            País<span class="text-error">*</span>
          </span>
        </label>

        <select
          bind:value={factform.country}
          name="country"
          class="select select-bordered w-full mt-1 {formstatus.country.error
            ? 'border-red-500'
            : ''}"
          on:change={onCountryChange}>
          <option value="" selected>Selecciona</option>
          {#each countries as country (country.isoCode)}
            <option value={country.isoCode}>
              {country.name}
            </option>
          {/each}
        </select>
        {#if formstatus.country.error}
          <small class="text-xs text-error">{formstatus.country.message}</small>
        {/if}
      </div>
      <div>
        <label for="state">
          <span class="font-meidum text-[14px] text-black">
            Estado/Provincia<span class="text-error">*</span>
          </span>
        </label>
        <select
          bind:value={factform.state}
          name="state"
          class="select select-bordered w-full mt-1 {formstatus.state.error
            ? 'border-red-500'
            : ''}"
          on:change={onStateChange}>
          <option value="" selected>Selecciona</option>
          {#each states as state (state.isoCode)}
            <option value={state.isoCode}>
              {state.name}
            </option>
          {/each}
        </select>
        {#if formstatus.state.error}
          <small class="text-xs text-error">{formstatus.state.message}</small>
        {/if}
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="city">
          <span class="font-meidum text-[14px] text-black">
            Cuidad<span class="text-error">*</span>
          </span>
        </label>

        <select
          name="city"
          bind:value={factform.city}
          class="select select-bordered w-full mt-1 {formstatus.city.error
            ? 'border-red-500'
            : ''}">
          <option value="" selected>Selecciona</option>
          {#each cities as city (city.name)}
            <option value={city.name}>
              {city.name}
            </option>
          {/each}
        </select>
        {#if formstatus.city.error}
          <small class="text-xs text-error">{formstatus.city.message}</small>
        {/if}
      </div>
      <div>
        <label for="zip">
          <span class="font-meidum text-[14px] text-black">
            Código Postal<span class="text-error">*</span>
          </span>
        </label>
        <input
          name="zip"
          bind:value={factform.zip}
          class="input input-bordered w-full input-md mt-1 {formstatus.zip.error
            ? 'border-red-500'
            : ''}"
          type="text"
          placeholder="ingresa tu código postal" />
        {#if formstatus.zip.error}
          <small class="text-xs text-error">{formstatus.zip.message}</small>
        {/if}
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="street">
          <span class="font-meidum text-[14px] text-black">
            Calle<span class="text-error">*</span>
          </span>
        </label>
        <input
          name="street"
          bind:value={factform.street}
          class="input input-bordered w-full input-md mt-1 {formstatus.street
            .error
            ? 'border-red-500'
            : ''}"
          type="text"
          placeholder="ingresa tu calle" />
        {#if formstatus.street.error}
          <small class="text-xs text-error">{formstatus.street.message}</small>
        {/if}
      </div>
      <div>
        <label for="numberstreet">
          <span class="font-meidum text-[14px] text-black">
            Numero<span class="text-error">*</span>
          </span>
        </label>
        <input
          name="numberstreet"
          bind:value={factform.numberstreet}
          class="input input-bordered w-full input-md mt-1 {formstatus
            .numberstreet.error
            ? 'border-red-500'
            : ''}"
          type="text"
          placeholder="ingresa número interior o exterior" />
        {#if formstatus.numberstreet.error}
          <small class="text-xs text-error"
            >{formstatus.numberstreet.message}</small>
        {/if}
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 mt-7">
      <div>
        <label for="iscompany">
          <span class="font-meidum text-[14px] text-black">
            ¿Eres una empresa?<span class="text-error">*</span>
          </span>
        </label>
        <div class="flex gap-3 items-center mr-2 mt-4">
          <div class="flex gap-2 items-center">
            <input
              on:change={(event) => (factform.iscompany = event.target.value)}
              type="radio"
              name="iscompany"
              class="radio checked:bg-primary"
              value="si"
              checked />
            <span class="font-meidum text-[14px] text-black"> Si </span>
          </div>

          <div class="flex gap-2 items-center">
            <input
              on:change={(event) => (factform.iscompany = event.target.value)}
              type="radio"
              name="iscompany"
              class="radio checked:bg-primary"
              value="no" />
            <span class="font-meidum text-[14px] text-black"> No </span>
          </div>
        </div>
      </div>
      <div>
        <label for="numberregister">
          <span class="font-meidum text-[14px] text-black">
            Número de Registro<span class="text-error">*</span>
          </span>
        </label>
        <input
          name="numberregister"
          class="input input-bordered w-full input-md mt-1 {formstatus
            .numberregister.error
            ? 'border-red-500'
            : ''}"
          type="text"
          bind:value={factform.numberregister}
          placeholder="ingresa número de registro" />
        {#if formstatus.numberregister.error}
          <small class="text-xs text-error"
            >{formstatus.numberregister.message}</small>
        {/if}
      </div>
    </section>

    <label class="cursor-pointer flex gap-1 mt-8">
      <input
        type="checkbox"
        name="terms"
        checked
        bind:value={factform.terms}
        class="checkbox checkbox-sm checkbox-primary" />
      <span class="label-text">Acepto los términos y condiciones.</span>
      {#if formstatus.terms.error}
        <small class="text-xs text-error">{formstatus.terms.message}</small>
      {/if}
    </label>

    <button
      bind:this={btn1}
      type="button"
      on:click={handleSend}
      class="btn btn-neutral text-primary hover:opacity-50 rounded-xl block ml-auto my-10">
      Guardar Cambios
    </button>
    <button
      bind:this={btn2}
      formaction="?/saveFactForm"
      class="btn btn-neutral text-primary hover:opacity-50 rounded-xl block ml-auto my-10 hidden">
      Save Fact
    </button>
  </form>
{:else}
  <div class="flex flex-col gap-9">
    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">NOMBRE</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.name ? $userData?.billing?.name : "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">APELLIDOS</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.lastname ? $userData?.billing?.lastname : "None"}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs"
          >CORREO ELECTRÓNICO</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.name ? $userData?.billing?.email : "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs"
          >NUMERO DE TELEFONO</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.phoneNumber
            ? $userData?.billing?.phoneNumber
            : "None"}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">PAÍS</small>
        <p class="text-sm md:text-md">
          {getCountryName($userData?.billing?.country) || "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs"
          >ESTADO/PROVINCIA</small>
        <p class="text-sm md:text-md">
          {getStateName(
            $userData?.billing?.country,
            $userData?.billing?.state
          ) || "None"}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">CUIDAD</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.city || "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">CÓDIGO POSTAL</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.zip ? $userData?.billing?.zip : "None"}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">CALLE</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.street1 ? $userData?.billing?.street1 : "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs">NUMERO</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.street2 ? $userData?.billing?.street2 : "None"}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 w-full">
      <div class="flex flex-col gap-4">
        <small class="text-base-200 font-semibold text-xs"
          >NUMERO DE REGISTRO</small>
        <p class="text-sm md:text-md">
          {$userData?.billing?.numberregister
            ? $userData?.billing?.numberregister
            : "None"}
        </p>
      </div>
      <div class="flex flex-col gap-4" />
    </section>
  </div>
  <button
    type="button"
    class="btn btn-ghost btn-xs text-error mt-9 block mx-auto md:flex md:mx-0"
    on:click={setData}>
    MODIFICAR LOS DATOS DE FACTURACIÓN
  </button>
{/if}

<style>
  @import "intl-tel-input/build/css/intlTelInput.css";

  /* .iti {
    width: 100% !important;
    background-color: red !important;
  } */
</style>
