import { getEvents } from "$lib/server/firebase-collections";
import { getAllCollections } from "$lib/server/shopify";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ locals, cookies }) => {
  const res = await getAllCollections();
  let statuscheckout = null;
  if (res.status === 200) {
    const products = res.body?.data?.collections?.edges;
    const datares = await getEvents(products);

    const rescheckoutstatus = cookies.get(`checkout-process`);
    if (rescheckoutstatus) statuscheckout = await JSON.parse(rescheckoutstatus);

    // console.log(rescheckoutstatus);
    console.log(statuscheckout);

    if (statuscheckout) throw redirect(302, `/event/${statuscheckout.event}`);

    console.log("hgereeee");
    if (products) {
      return {
        products: datares,
        user: locals.userdata,
        statuscheckout,
      };
    }
    // throw error(404);
    console.log("final");
  } else {
    throw error(res.status);
  }
};
