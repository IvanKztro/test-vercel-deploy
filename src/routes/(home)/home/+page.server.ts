import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getAllCollections } from "$lib/server/shopify";
import {
  getEvents,
  getForms,
  getNotifications,
} from "$lib/server/firebase-collections";

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
  const resuser = cookies.get("userdata");
  const user = JSON.parse(resuser);
  const res = await getAllCollections();
  let statuscheckout = null;
  if (res.status === 200) {
    const products = res.body?.data?.collections?.edges;
    const datares = await getEvents(products);

    const resforms = await getForms();

    console.log(cookies.getAll());
    const rescheckoutstatus = cookies.get(`checkout-process`);
    if (rescheckoutstatus) statuscheckout = await JSON.parse(rescheckoutstatus);

    console.log("statuscheckout");
    console.log(rescheckoutstatus);
    console.log(statuscheckout);

    if (statuscheckout) {
      // throw redirect(302, `/event/${statuscheckout.event}`);
      return {
        products: datares,
        user: locals.userdata,
        statuscheckout,
        urlredirect: `/event/${statuscheckout.event}`,
        // notifications: resnoptifications,
        forms: resforms,
      };
    }
    if (products) {
      const resnoptifications = await getNotifications(user.firebaseID);
      return {
        products: datares,
        user: locals.userdata,
        statuscheckout,
        notifications: resnoptifications,
        forms: resforms,
      };
    }
    console.log("final");

    // throw error(404);
  } else {
    throw error(res.status);
  }
};
