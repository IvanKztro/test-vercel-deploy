import { goto } from "$app/navigation";
import { productName } from "./stores/cart-store";
import { currentEvent } from "./stores/event-store";
import { Country, State, City } from "country-state-city";

export function handleAuthError(errorCode: string) {
  let error: string = "";
  switch (errorCode) {
    case "Unidentified customer":
      error = "Correo o contraseña incorrectas";
      break;

    case "Email has already been taken":
      error = "Este correo ya ha sido usado";
      break;

    case "Creating Customer Limit exceeded. Please try again later.":
      error = "Intentos excedidos, trate más tarde";
      break;

    default:
      error = "Error, Intente mas tarde.";
      break;
  }
  return error;
}

export function handleFormError(errorCode: string) {
  let error: string = "";
  switch (errorCode) {
    case "name":
      error = "Nombre es requerido";
      break;

    case "lastname":
      error = "Apellido es requerido";
      break;

    case "email":
      error = "Correo electronico no valido";
      break;

    case "identity":
      error = "Cédula de indentidad no valida";
      break;

    case "phone":
      error = "Télefono no valido";
      break;
    case "deel":
      error = "Aceptar acuerdo es requerido";
      break;

    case "confirmation":
      error = "Debe confirmar que es mayor de edad";
      break;

    case "country":
      error = "Debe seleccionar un pais";
      break;

    case "state":
      error = "Debe seleccionar un estado";
      break;

    case "city":
      error = "Debe seleccionar una ciudad";
      break;

    case "zip":
      error = "Ingrese una identificación valida";
      break;

    case "street":
      error = "Ingrese una identificación valida";
      break;

    case "numberstreet ":
      error = "Ingrese una identificación valida";
      break;

    case "numberregister":
      error = "Ingrese una identificación valida";
      break;

    case "teerms":
      error = "Aceptar acuerdo es requerido ";
      break;

    default:
      error = "Error, Intente mas tarde.";
      break;
  }
  return error;
}

export function setCookie(name: string, data: any) {
  const json = JSON.stringify(data);
  document.cookie = `${name}=${json};path=/`;
}

export function deleteCookieData(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getCookieData(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  if (ca?.length > 0)
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        const data = c.substring(name.length, c.length);
        const json: any = JSON.parse(data as string);
        return json;
      }
    }
  return null;
}

// export function splitRoute(route: any) {
//   const split = route.split("/");
//   return split[split.length - 1];
// }

export function concatRoute(id: string) {
  return `gid://shopify/Product/${id}`;
}

export function setCurrentEvent(event: any) {
  currentEvent.set(event);
  productName.set(event.handle);

  const route = `/event/${event.handle}`;
  goto(route);
}

export function generateOrderNumber() {
  let num = "";
  for (let i = 0; i < 16; i++) {
    const digit = Math.floor(Math.random() * 10);
    num += digit;
  }
  return num;
}

export function getCountries(): any[] {
  return Country.getAllCountries();
}

export function getStates(countryCode: string): any[] {
  return State.getStatesOfCountry(countryCode);
}

export function getCities(countryCode: string, stateCode: string): any[] {
  return City.getCitiesOfState(countryCode, stateCode);
}

export function detectCurrentPage(currentP: string) {
  switch (currentP) {
    case "/":
    case "/event/team-perreo":
    case "/home":
      return "home";
    case "/tickets":
      return "tickets";
    case "/settings":
      return "settings";
    default:
      return "other";
  }
}

export function getOrderNumber(stringdata: string) {
  const regexOrder = /Order\/(\d+)/;
  const regexKey = /key=(\w+)/;

  const numorder = stringdata.match(regexOrder)[1];
  const valuekey = stringdata.match(regexKey)[1];

  const res = `${numorder}-${valuekey}`;

  return res;
}

export function validateEmail(email: string) {
  const emailRegex =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}([a-zA-Z]{0,10})?$/;
  return emailRegex.test(email);
}

export function validateIdentity(input: string) {
  if (input) input = input.replace(/\s/g, "").trim();

  let formato = "Formato no válido";

  if (/^\d-\d{4}-\d{4}$/.test(input)) {
    formato = "Cédula Física";
  } else if (/^3-\d{3}-\d{6}$/.test(input)) {
    formato = "Cédula Jurídica";
  } else if (/^\d{12}$/.test(input)) {
    formato = "DIMEX";
  } else if (/^[1-9]\d{9}$/.test(input)) {
    formato = "NITE";
  }

  return { isvalid: formato !== "Formato no válido", type: formato };
}
