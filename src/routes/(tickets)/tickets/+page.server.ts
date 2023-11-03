import { getOrdersByUser } from "$lib/server/firebase-collections";
import { getCustomerOrders } from "$lib/server/shopify";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
  const user = locals.userdata;

  let statuscheckout = null;

  const rescheckoutstatus = cookies.get(`checkout-process`);
  console.log(cookies.getAll());
  //  const rescheckoutstatus = cookies.get(`checkout-process`);
  if (rescheckoutstatus) statuscheckout = await JSON.parse(rescheckoutstatus);

  console.log("rescheckoutstatus");
  console.log(rescheckoutstatus);
  console.log(statuscheckout);

  if (statuscheckout) throw redirect(302, `/event/${statuscheckout.event}`);

  const resOrders = await getCustomerOrders(user.accessToken);

  const orders = resOrders.body.data.customer.orders.edges.filter(
    (o: any) => o.node.financialStatus === "PAID"
  );

  const ordersByUser = await getOrdersByUser(user.firebaseID, orders);

  if (resOrders.body.errors)
    return { user: locals.userdata, errors: resOrders.body.errors };
  else
    return {
      user: locals.userdata,
      orders: ordersByUser.edges,
    };
};
