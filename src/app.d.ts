declare namespace App {
  interface Locals {}

  interface Platform {
    env: {
      COUNTER: DurableObjectNamespace;
    };
    context: {
      waitUntil(promise: Promise<any>): void;
    };
    caches: CacheStorage & { default: Cache };
  }
  interface Session {}

  interface Stuff {}
}

declare module "date-fns/locale/index.js" {
  import { es } from "date-fns/locale";
  export { es };
}
// import es from "date-fns/locale/es/index";

// import format from "date-fns/esm/format/index";

// // See https://kit.svelte.dev/docs/types#app
// // for information about these interfaces
// declare global {
//   namespace App {
//     // interface Error {}
//     // interface Locals {}
//     // interface PageData {}
//     // interface Platform {}
//   }
//   interface Platform {
//     env: {
//       COUNTER: DurableObjectNamespace;
//     };
//     context: {
//       waitUntil(promise: Promise<any>): void;
//     };
//     caches: CacheStorage & { default: Cache };
//   }
// }

// export {};
