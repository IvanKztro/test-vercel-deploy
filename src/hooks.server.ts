import { getCustomerInfo } from "$lib/server/shopify";
import { redirect } from "@sveltejs/kit";
import { building } from "$app/environment";

let routesPublics = ["/sign-in", "/sign-up", "/reset-password"];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (building) {
    const response = await resolve(event);
    return response; // bailing here allows the 404 page to build
  }

  const res = event.cookies.get("userdata");

  if (event.url.pathname === "/") throw redirect(303, "/home");
  const isroutepublic = routesPublics.includes(event.url.pathname as string);

  if (res) {
    const user = JSON.parse(res);

    const customerInfo = await getCustomerInfo(user.accessToken);

    event.locals.userdata = {
      accessToken: customerInfo.accessToken,
      ...customerInfo.customer,
      firebaseID: user?.firebaseID,
      billing: user?.billing ? user?.billing : null,
    };

    if (isroutepublic && customerInfo?.customer) throw redirect(303, "/home");

    const response = await resolve(event);
    return response;
  } else {
    event.locals.userdata = null;

    if (!isroutepublic) throw redirect(303, "/sign-in");

    const response = await resolve(event);
    return response;
  }
}
