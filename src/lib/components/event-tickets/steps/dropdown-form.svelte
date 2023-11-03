<script lang="ts">
  import { productName, ticketsJson } from "$lib/stores/cart-store";
  import { handleFormError, validateEmail, validateIdentity } from "$lib/utils";
  import { onMount } from "svelte";
  import intlTelInput from "intl-tel-input";
  import "intl-tel-input/build/js/utils";
  import AlertBasic from "$lib/components/alert-basic.svelte";
  import { get } from "svelte/store";

  export let infoticket: any;
  export let ticket: any;
  const filteredInfoTickets = {};
  export let increment: Function;

  let formstatus: any = {
    deel: {
      error: false,
      message: "",
    },
    name: {
      error: false,
      message: "",
    },
    lastname: {
      error: false,
      message: "",
    },
    email: {
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
    confirmation: {
      error: false,
      message: "",
    },
  };

  const tooltip = `
  Cédula Fisica: 1-0000-0000
  Cédula Jurídica: 3-000-000000
  DIMEX: 12 dígitos.
  NITE: 10 dígitos, sin 0 y guión al inicio.
  `;

  let phone: any = "";
  let inputError = "";
  const message: string =
    "Importante: Por favor, escribe los datos del comprador como aparecen en la identificación oficial e incluye el segundo nombre en caso de tenerlo. Puede estar sujeto a jurisdicción del destino final en caso de no coincidir.";

  let typeIdentity = "";

  let it: any = null;
  let _phone: any = { valid: false, value: "", error: "" };

  onMount(() => {
    for (const key in ticket.infoTickets) {
      if (ticket.infoTickets[key].done) {
        filteredInfoTickets[key] = { ...ticket.infoTickets[key] };
        increment();
      }
    }
    setTimeout(() => {
      setRef(infoticket.infoticketID);
    }, 1000);
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
  }

  async function addInfoTicket() {
    inputError = "";
    const res: any = validateData();
    if (!res) {
      inputError = res.key as string;
      return;
    }

    if ($ticketsJson) {
      const ticketData: any = get(ticketsJson);
      ticketData[infoticket.idVariantShopify].infoTickets[
        infoticket.infoticketID
      ] = infoticket;
      ticketData[infoticket.idVariantShopify].infoTickets[
        infoticket.infoticketID
      ].phone = infoticket.phone;

      infoticket.done = true;
    }
  }

  function validateData() {
    let res = true;
    typeIdentity = "";
    for (const key in infoticket) {
      if (formstatus[key]) {
        formstatus[key] = {
          error: false,
          message: "",
        };

        const res2 = handleFormError(key);
        if (
          (infoticket[key] === "" && key !== "phone") ||
          (key === "phone" && !_phone?.valid) ||
          (typeof infoticket[key] === "boolean" && !infoticket[key])
        ) {
          formstatus[key] = {
            error: true,
            message: res2,
          };
          res = false;
        }

        if (key === "email" && !validateEmail(infoticket[key])) {
          formstatus[key] = {
            error: true,
            message: res2,
          };
          res = false;
        }

        if (key === "identity") {
          const resIdentity = validateIdentity(infoticket[key] || "");
          if (!resIdentity.isvalid) {
            formstatus[key] = {
              error: true,
              message: res2,
            };
            res = false;
          }
        } else if (key === "identity") {
          const resIdentity = validateIdentity(infoticket[key] || "");
          if (resIdentity.isvalid) typeIdentity = resIdentity.type;
        }
      }
    }
    return res;
  }
</script>

<div />

{#if infoticket}
  <section class="py-7 px-0 md:px-5">
    <form class="flex flex-col gap-3 mb-6">
      <article class="grid grid-rows lg:grid-cols-4">
        <h3 class=" text-primary text-lg font-medium mb-4 lg:mb-0">
          Información Personal
        </h3>
        <div class="col-span-3">
          <AlertBasic className=" bg-[#3ABFF81A] border-0" {message} />

          <section class="grid grid-rows md:grid-cols-2 gap-4 mt-7">
            <div class="">
              <label for="name">
                <span class="font-meidum text-[12px] text-black"
                  >Nombre<span class="text-error">*</span></span>
              </label>
              <input
                bind:value={infoticket.name}
                class="input input-bordered w-[100%] md:w-full input-md mt-1 {formstatus
                  .name.error
                  ? 'border-red-500'
                  : ''}"
                type="text"
                placeholder="Ingresa tu nombre" />
              {#if formstatus.name.error}
                <small class="text-xs text-error"
                  >{formstatus.name.message}</small>
              {/if}
            </div>
            <div>
              <label for="lastname">
                <span class="font-meidum text-[12px] text-black"
                  >Apellidos<span class="text-error">*</span></span>
              </label>
              <input
                bind:value={infoticket.lastname}
                class="input input-bordered w-[100%] md:w-full input-md mt-1 {formstatus
                  .lastname.error
                  ? 'border-red-500'
                  : ''}"
                type="text"
                placeholder="Ingresa tus apellidos" />
              {#if formstatus.lastname.error}
                <small class="text-xs text-error"
                  >{formstatus.lastname.message}</small>
              {/if}
            </div>
          </section>
        </div>
      </article>

      <article class="grid grid-rows lg:grid-cols-4 mt-[2rem]">
        <div>
          <h3 class="block mb-auto text-primary text-lg font-medium">
            Información de Contacto
          </h3>
        </div>
        <div class="col-span-3 mt-5 lg:mt-0">
          <section class="grid grid-rows md:grid-cols-2 gap-4 mt-7">
            <div>
              <label for="email">
                <span class="font-meidum text-[12px] text-black"
                  >Correo electrónico<span class="text-error">*</span></span>
              </label>
              <input
                bind:value={infoticket.email}
                class="input input-bordered w-[100%] md:w-full input-md mt-1 {formstatus
                  .email.error
                  ? 'border-red-500'
                  : ''}"
                type="email"
                placeholder="Ingresa tu correo electrónico" />
              {#if formstatus.email.error}
                <small class="text-xs text-error"
                  >{formstatus.email.message}</small>
              {/if}
            </div>
            <div>
              <label for="identity">
                <div class="flex mt-[6px]">
                  <span class="font-meidum text-[12px] text-black">
                    Cédula de identidad<span class="text-error">*</span>
                  </span>
                  <div
                    class="lg:tooltip whitespace-pre text-sm"
                    data-tip={tooltip}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-[16px] h-[16px]">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                </div>
              </label>
              <input
                bind:value={infoticket.identity}
                class="input input-bordered w-[100%] md:w-full input-md mt-1 {formstatus
                  .identity.error
                  ? 'border-red-500'
                  : ''}"
                type="text"
                placeholder="Ingresa tu cédula de identidad" />
              {#if formstatus.identity.error}
                <small class="text-xs text-error"
                  >{formstatus.identity.message}</small>
              {/if}
              {#if typeIdentity !== ""}
                <small class="text-xs text-success">{typeIdentity}</small>
              {/if}
            </div>
          </section>
          <section class="grid grid-rows md:grid-cols-2 gap-4 mt-2">
            <div class="flex flex-col gap-2 w-full">
              <label for="phoneticket">
                <span class="font-meidum text-[12px] text-black"
                  >Whatsapp<span class="text-error">*</span></span>
              </label>
              <input
                id={"phoneticket-" + infoticket.infoticketID}
                bind:value={phone}
                class="input input-bordered border-[#DBDEE2] bg-white w-full text-xs px-3 rounded {formstatus
                  .phone.error
                  ? 'border-red-500'
                  : ''}"
                type="tel"
                on:input={change}
                placeholder="Phone" />
              {#if formstatus.phone.error}
                <small class="text-xs text-error"
                  >{formstatus.phone.message}</small>
              {/if}
            </div>
            <div />
          </section>
          <div class="form-control mt-10 flex fex-col gap-2">
            <label class="cursor-pointer flex gap-1 items-center">
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                bind:checked={infoticket.deel} />
              <span
                class="font-medium text-[12px] text-black"
                class:text-red-500={formstatus.deel.error}
                >Estoy de acuerdo en recibir notificaciones del evento por
                Whatsapp</span>
            </label>
            {#if formstatus.deel.error}
              <small class="text-xs text-error"
                >{formstatus.deel.message}</small>
            {/if}
          </div>
          <div class="form-control mb-10 mt-2 flex fex-col gap-2">
            <label class="cursor-pointer flex gap-1 items-center">
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                bind:checked={infoticket.confirmation} />
              <span
                class="font-medium text-[12px] text-black"
                class:text-red-500={formstatus.confirmation.error}
                >Confirmo que soy mayor de edad y tengo una identificación
                oficial</span>
            </label>
            {#if formstatus.confirmation.error}
              <small class="text-xs text-error"
                >{formstatus.confirmation.message}</small>
            {/if}
          </div>
          <button
            on:click={addInfoTicket}
            type="button"
            class="btn btn-neutral rounded-xl text-primary w-full mb-8">
            SIGUIENTE TICKET
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </article>
    </form>
  </section>
{/if}

<style>
  @import "intl-tel-input/build/css/intlTelInput.css";
</style>
